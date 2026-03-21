import { VentaRepository } from '../../domain/repositories/VentaRepository.js';
import { Venta } from '../../domain/entities/Venta.js';

export class PrismaVentaRepository extends VentaRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  _toDomain(v) {
    if (!v) return null;
    return new Venta({
      id_venta:          v.id_venta,
      fecha_venta:       v.fecha_venta,
      subtotal:          v.subtotal,
      alicuota_iva:      v.alicuota_iva,
      monto_iva:         v.monto_iva,
      total:             v.total,
      id_moneda:         v.id_moneda,
      tasa_referencia:   v.tasa_referencia,
      reportable_seniat: v.reportable_seniat,
      estado:            v.estado,
      observacion:       v.observacion,
      id_usuario:        v.id_usuario,
      moneda:            v.moneda   ?? null,
      usuario:           v.usuario  ?? null,
      detalles:          v.detalles ?? [],
    });
  }

  /**
   * Registra una venta y descuenta el inventario en una transacción atómica.
   * - reportable_seniat = false → descuenta solo inventario GENERAL
   * - reportable_seniat = true  → descuenta inventario GENERAL y LEGAL
   * 
   * Si el stock es insuficiente, la transacción entera falla (rollback automático).
   */
  async save(venta) {
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Crear el registro de la venta
      const nuevaVenta = await tx.venta.create({
        data: {
          subtotal:          venta.subtotal,
          alicuota_iva:      venta.alicuota_iva ?? 16.00,
          monto_iva:         venta.monto_iva,
          total:             venta.total,
          id_moneda:         venta.id_moneda   ?? null,
          tasa_referencia:   venta.tasa_referencia ?? null,
          reportable_seniat: venta.reportable_seniat ?? false,
          observacion:       venta.observacion ?? null,
          estado:            'abierta',
          id_usuario:        venta.id_usuario,
        },
      });

      // 2. Procesar cada línea de detalle
      for (const det of venta.detalles) {
        // 2a. Crear el detalle
        await tx.detalleVenta.create({
          data: {
            id_venta:        nuevaVenta.id_venta,
            id_producto:     det.id_producto,
            cantidad:        det.cantidad,
            precio_unitario: det.precio_unitario,
            subtotal_linea:  det.subtotal_linea,
          },
        });

        // 2b. Descontar inventario general (siempre)
        await this._descontarInventario(tx, {
          id_producto:     det.id_producto,
          cantidad:        det.cantidad,
          tipo_inventario: 'general',
          id_usuario:      venta.id_usuario,
          id_venta:        nuevaVenta.id_venta,
        });

        // 2c. Si es SENIAT: también descontar inventario legal
        if (venta.reportable_seniat) {
          await this._descontarInventario(tx, {
            id_producto:     det.id_producto,
            cantidad:        det.cantidad,
            tipo_inventario: 'legal',
            id_usuario:      venta.id_usuario,
            id_venta:        nuevaVenta.id_venta,
          });
        }
      }

      return nuevaVenta;
    });

    return this.findById(result.id_venta);
  }

  /**
   * Descuenta stock en el modelo de inventario indicado y registra el movimiento.
   */
  async _descontarInventario(tx, { id_producto, cantidad, tipo_inventario, id_usuario, id_venta }) {
    const modelo   = tipo_inventario === 'general' ? 'inventarioGeneral' : 'inventarioLegal';
    const campoId  = 'id_producto';
    const cant     = parseFloat(cantidad);

    const registro = await tx[modelo].findUnique({ where: { [campoId]: id_producto } });
    if (!registro) {
      throw new Error(`Sin registro de inventario ${tipo_inventario} para producto ${id_producto}`);
    }

    const anterior = parseFloat(registro.cantidad_actual);
    const nueva    = anterior - cant;
    if (nueva < 0) {
      throw new Error(
        `Stock ${tipo_inventario} insuficiente para producto ${id_producto}. ` +
        `Disponible: ${anterior}, solicitado: ${cant}`
      );
    }

    await tx[modelo].update({
      where: { [campoId]: id_producto },
      data: { cantidad_actual: nueva, fecha_actualizacion: new Date() },
    });

    await tx.movimientoInventario.create({
      data: {
        id_producto,
        tipo_movimiento:  'salida',
        tipo_inventario,
        cantidad:          cant,
        cantidad_anterior: anterior,
        cantidad_nueva:    nueva,
        id_usuario,
        id_origen:         id_venta,
        id_origen_tipo:    'venta',
        observacion:       `Salida por venta #${id_venta}`,
      },
    });
  }

  /**
   * Anula la venta y RESTAURA el inventario (entradas inversas) en una transacción.
   */
  async anular(id, id_usuario) {
    const venta = await this.findById(id);
    if (!venta) throw new Error('Venta no encontrada');

    await this.prisma.$transaction(async (tx) => {
      // Marcar como anulada
      await tx.venta.update({
        where: { id_venta: parseInt(id) },
        data: { estado: 'anulada' },
      });

      // Restaurar inventario por cada detalle
      for (const det of venta.detalles) {
        await this._restaurarInventario(tx, {
          id_producto:     det.id_producto,
          cantidad:        det.cantidad,
          tipo_inventario: 'general',
          id_usuario,
          id_venta:        parseInt(id),
        });

        if (venta.reportable_seniat) {
          await this._restaurarInventario(tx, {
            id_producto:     det.id_producto,
            cantidad:        det.cantidad,
            tipo_inventario: 'legal',
            id_usuario,
            id_venta:        parseInt(id),
          });
        }
      }
    });

    return this.findById(id);
  }

  async _restaurarInventario(tx, { id_producto, cantidad, tipo_inventario, id_usuario, id_venta }) {
    const modelo  = tipo_inventario === 'general' ? 'inventarioGeneral' : 'inventarioLegal';
    const cant    = parseFloat(cantidad);

    const registro = await tx[modelo].findUnique({ where: { id_producto } });
    if (!registro) return; // Si no existe, no hay nada que restaurar

    const anterior = parseFloat(registro.cantidad_actual);
    const nueva    = anterior + cant;

    await tx[modelo].update({
      where: { id_producto },
      data: { cantidad_actual: nueva, fecha_actualizacion: new Date() },
    });

    await tx.movimientoInventario.create({
      data: {
        id_producto,
        tipo_movimiento:  'entrada',
        tipo_inventario,
        cantidad:          cant,
        cantidad_anterior: anterior,
        cantidad_nueva:    nueva,
        id_usuario,
        id_origen:         id_venta,
        id_origen_tipo:    'venta_anulada',
        observacion:       `Restauración por anulación de venta #${id_venta}`,
      },
    });
  }

  async findById(id) {
    const v = await this.prisma.venta.findUnique({
      where: { id_venta: parseInt(id) },
      include: {
        moneda:  { select: { codigo: true, simbolo: true } },
        usuario: { select: { nombre: true } },
        detalles: {
          include: {
            producto: { select: { nombre: true, codigo_barra: true, unidad_medida: true } },
          },
        },
      },
    });
    return this._toDomain(v);
  }

  async findAll({ page = 1, limit = 20, estado, reportable_seniat, fecha_desde, fecha_hasta } = {}) {
    const skip = (page - 1) * limit;
    const where = {
      ...(estado ? { estado } : {}),
      ...(reportable_seniat !== undefined
        ? { reportable_seniat: reportable_seniat === 'true' || reportable_seniat === true }
        : {}),
      ...(fecha_desde || fecha_hasta
        ? {
            fecha_venta: {
              ...(fecha_desde ? { gte: new Date(fecha_desde) } : {}),
              ...(fecha_hasta ? { lte: new Date(fecha_hasta + 'T23:59:59') } : {}),
            },
          }
        : {}),
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [ventas, total, totalHoy, totalAnuladas] = await this.prisma.$transaction([
      this.prisma.venta.findMany({
        where, skip, take: limit,
        orderBy: { fecha_venta: 'desc' },
        include: {
          moneda:  { select: { codigo: true, simbolo: true } },
          usuario: { select: { nombre: true } },
          detalles: {
            include: { producto: { select: { nombre: true, unidad_medida: true } } },
          },
        },
      }),
      this.prisma.venta.count({ where }),
      this.prisma.venta.aggregate({
        where: { estado: 'abierta', fecha_venta: { gte: today } },
        _sum: { total: true }
      }),
      this.prisma.venta.count({
        where: { estado: 'anulada', ...(fecha_desde || fecha_hasta ? { fecha_venta: where.fecha_venta } : {}) }
      })
    ]);

    return {
      data: ventas.map(v => this._toDomain(v)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: {
        totalVentasHoy: totalHoy._sum.total || 0,
        countAnuladas: totalAnuladas,
        totalGeneral: (await this.prisma.venta.aggregate({ where: { estado: 'abierta' }, _sum: { total: true } }))._sum.total || 0
      }
    };
  }
}
