import { CompraRepository } from '../../domain/repositories/CompraRepository.js';
import { Compra } from '../../domain/entities/Compra.js';

export class PrismaCompraRepository extends CompraRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  _toDomain(c) {
    if (!c) return null;
    return new Compra({
      id_compra: c.id_compra,
      id_proveedor: c.id_proveedor,
      fecha_compra: c.fecha_compra,
      numero_factura: c.numero_factura,
      subtotal: c.subtotal,
      id_moneda_subtotal: c.id_moneda_subtotal,
      tasa_referencia: c.tasa_referencia,
      base_imponible: c.base_imponible,
      alicuota_iva: c.alicuota_iva,
      monto_iva: c.monto_iva,
      total: c.total,
      reportable_seniat: c.reportable_seniat,
      estado: c.estado,
      proveedor: c.proveedor ?? null,
      detalles: c.detalles ?? [],
    });
  }

  /**
   * Registra una compra aplicando la lógica de inventario dual:
   * - reportable_seniat=true: detalles van a AMBOS inventarios (general y legal)
   * - reportable_seniat=false: detalles solo van al inventario GENERAL
   * Las notas de crédito asociadas solo afectan el inventario GENERAL.
   */
  async save(compra) {
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Crear la compra principal
      const nuevaCompra = await tx.compra.create({
        data: {
          id_proveedor: compra.id_proveedor,
          numero_factura: compra.numero_factura,
          subtotal: compra.subtotal,
          id_moneda_subtotal: compra.id_moneda_subtotal,
          tasa_referencia: compra.tasa_referencia,
          base_imponible: compra.base_imponible,
          alicuota_iva: compra.alicuota_iva ?? 16.00,
          monto_iva: compra.monto_iva,
          total: compra.total,
          reportable_seniat: compra.reportable_seniat,
          estado: 'pendiente',
        }
      });

      // 2. Procesar detalles e impactar inventario
      for (const det of compra.detalles) {
        const detCreado = await tx.detalleCompra.create({
          data: {
            id_compra: nuevaCompra.id_compra,
            id_producto: det.id_producto,
            cantidad: det.cantidad,
            precio_unitario: det.precio_unitario,
            subtotal_linea: parseFloat(det.cantidad) * parseFloat(det.precio_unitario),
          }
        });

        // Determinar qué inventarios impactar según flag SENIAT
        const tipoInventario = compra.reportable_seniat ? 'ambos' : 'general';

        await this._moverInventario(tx, {
          id_producto: det.id_producto,
          cantidad: det.cantidad,
          tipo_movimiento: 'entrada',
          tipo_inventario: tipoInventario,
          id_usuario: compra.id_usuario,
          id_origen: nuevaCompra.id_compra,
          id_origen_tipo: 'compra',
          observacion: `Entrada por compra #${nuevaCompra.id_compra}${compra.reportable_seniat ? ' (SENIAT)' : ''}`,
        });

        // 3. Si hay nota de crédito para este detalle, solo afecta inventario GENERAL
        if (det.nota_credito) {
          await tx.notaCredito.create({
            data: {
              id_compra: nuevaCompra.id_compra,
              id_detalle_compra: detCreado.id_detalle,
              id_producto: det.id_producto,
              cantidad: det.nota_credito.cantidad,
              valor_unitario: det.nota_credito.valor_unitario ?? null,
              id_moneda: det.nota_credito.id_moneda ?? null,
              fecha: new Date(det.nota_credito.fecha ?? new Date()),
              observacion: det.nota_credito.observacion ?? null,
            }
          });

          // La nota crédito SIEMPRE va solo al inventario GENERAL
          await this._moverInventario(tx, {
            id_producto: det.id_producto,
            cantidad: det.nota_credito.cantidad,
            tipo_movimiento: 'nota_credito',
            tipo_inventario: 'general',
            id_usuario: compra.id_usuario,
            id_origen: nuevaCompra.id_compra,
            id_origen_tipo: 'nota_credito',
            observacion: `Nota crédito sobre compra #${nuevaCompra.id_compra}`,
          });
        }
      }

      return nuevaCompra;
    });

    return this.findById(result.id_compra);
  }

  async _moverInventario(tx, { id_producto, cantidad, tipo_movimiento, tipo_inventario, id_usuario, id_origen, id_origen_tipo, observacion }) {
    const ajustar = async (modelo, campo_id, tipoInv) => {
      const reg = await tx[modelo].findUnique({ where: { [campo_id]: id_producto } });
      if (!reg) throw new Error(`Sin registro de inventario ${tipoInv} para producto ${id_producto}`);
      const anterior = parseFloat(reg.cantidad_actual);
      const esSalida = tipo_movimiento === 'salida' || tipo_movimiento === 'nota_credito';
      const nueva = esSalida ? anterior - parseFloat(cantidad) : anterior + parseFloat(cantidad);
      if (nueva < 0) throw new Error(`Stock ${tipoInv} insuficiente para producto ${id_producto}`);
      await tx[modelo].update({ where: { [campo_id]: id_producto }, data: { cantidad_actual: nueva, fecha_actualizacion: new Date() } });
      await tx.movimientoInventario.create({
        data: {
          id_producto, tipo_movimiento, tipo_inventario: tipoInv,
          cantidad: parseFloat(cantidad), cantidad_anterior: anterior, cantidad_nueva: nueva,
          id_usuario, id_origen, id_origen_tipo, observacion,
        }
      });
    };

    if (tipo_inventario === 'general' || tipo_inventario === 'ambos') await ajustar('inventarioGeneral', 'id_producto', 'general');
    if (tipo_inventario === 'legal'   || tipo_inventario === 'ambos') await ajustar('inventarioLegal',   'id_producto', 'legal');
  }

  async findById(id) {
    const c = await this.prisma.compra.findUnique({
      where: { id_compra: parseInt(id) },
      include: {
        proveedor: { select: { nombre: true, ruc: true } },
        detalles: { include: { producto: { select: { nombre: true, codigo_barra: true } }, notas_credito: true } },
        moneda: { select: { codigo: true, simbolo: true } },
      }
    });
    return this._toDomain(c);
  }

  async findAll({ page = 1, limit = 20, id_proveedor, reportable_seniat, estado } = {}) {
    const skip = (page - 1) * limit;
    const where = {
      ...(id_proveedor ? { id_proveedor: parseInt(id_proveedor) } : {}),
      ...(reportable_seniat !== undefined ? { reportable_seniat: reportable_seniat === 'true' || reportable_seniat === true } : {}),
      ...(estado ? { estado } : {}),
    };
    const [compras, total] = await this.prisma.$transaction([
      this.prisma.compra.findMany({
        where, skip, take: limit,
        orderBy: { fecha_compra: 'desc' },
        include: { proveedor: { select: { nombre: true } }, moneda: { select: { codigo: true } } }
      }),
      this.prisma.compra.count({ where })
    ]);
    return { data: compras.map(c => this._toDomain(c)), total, page, totalPages: Math.ceil(total / limit) };
  }

  async updateEstado(id, estado) {
    const updated = await this.prisma.compra.update({
      where: { id_compra: parseInt(id) },
      data: { estado }
    });
    return this._toDomain(updated);
  }

  async cancelar(id) {
    return this.updateEstado(id, 'cancelada');
  }
}
