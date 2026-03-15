import { ProductoRepository } from '../../domain/repositories/ProductoRepository.js';
import { Producto } from '../../domain/entities/Producto.js';

export class PrismaProductoRepository extends ProductoRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  _toDomain(p, opts = {}) {
    if (!p) return null;
    return new Producto({
      id_producto: p.id_producto,
      codigo_barra: p.codigo_barra,
      nombre: p.nombre,
      descripcion: p.descripcion,
      categoria: p.categoria,
      unidad_medida: p.unidad_medida,
      id_moneda_precio: p.id_moneda_precio,
      peso_unitario: p.peso_unitario,
      activo: p.activo,
      inventario_general: p.inventario_general ?? null,
      inventario_legal: p.inventario_legal ?? null,
    });
  }

  async save(producto) {
    const created = await this.prisma.$transaction(async (tx) => {
      const prod = await tx.producto.create({
        data: {
          codigo_barra: producto.codigo_barra,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          categoria: producto.categoria,
          unidad_medida: producto.unidad_medida,
          id_moneda_precio: producto.id_moneda_precio,
          peso_unitario: producto.peso_unitario,
          activo: true,
        }
      });
      // Inicializar ambos inventarios en 0
      await tx.inventarioGeneral.create({
        data: { id_producto: prod.id_producto, cantidad_actual: 0 }
      });
      await tx.inventarioLegal.create({
        data: { id_producto: prod.id_producto, cantidad_actual: 0 }
      });
      return prod;
    });
    return this.findById(created.id_producto);
  }

  async findById(id) {
    const p = await this.prisma.producto.findUnique({
      where: { id_producto: parseInt(id) },
      include: { inventario_general: true, inventario_legal: true }
    });
    return this._toDomain(p);
  }

  async findAll({ page = 1, limit = 20, search = '', categoria = '' } = {}) {
    const skip = (page - 1) * limit;
    const where = {
      activo: true,
      ...(search ? {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { codigo_barra: { contains: search, mode: 'insensitive' } },
        ]
      } : {}),
      ...(categoria ? { categoria } : {})
    };

    const [productos, total] = await this.prisma.$transaction([
      this.prisma.producto.findMany({
        where, skip, take: limit,
        orderBy: { nombre: 'asc' },
        include: { inventario_general: true, inventario_legal: true }
      }),
      this.prisma.producto.count({ where })
    ]);

    return {
      data: productos.map(p => this._toDomain(p)),
      total, page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async update(producto) {
    const updated = await this.prisma.producto.update({
      where: { id_producto: producto.id_producto },
      data: {
        codigo_barra: producto.codigo_barra,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        categoria: producto.categoria,
        unidad_medida: producto.unidad_medida,
        id_moneda_precio: producto.id_moneda_precio,
        peso_unitario: producto.peso_unitario,
        activo: producto.activo,
      },
      include: { inventario_general: true, inventario_legal: true }
    });
    return this._toDomain(updated);
  }

  async softDelete(id) {
    await this.prisma.producto.update({
      where: { id_producto: parseInt(id) },
      data: { activo: false }
    });
  }

  /**
   * Ajusta inventario y registra el movimiento en una transacción atómica.
   * tipo_inventario: 'general' | 'legal' | 'ambos'
   * tipo_movimiento: 'entrada' | 'salida' | 'ajuste' | 'nota_credito'
   */
  async ajustarInventario({ id_producto, tipo_inventario, cantidad, tipo_movimiento, id_usuario, observacion = null, id_origen = null, id_origen_tipo = null }) {
    const prodId = parseInt(id_producto);
    const cant = parseFloat(cantidad);

    await this.prisma.$transaction(async (tx) => {
      const ajustar = async (modelo, campo_id) => {
        const registro = await tx[modelo].findUnique({ where: { [campo_id]: prodId } });
        if (!registro) throw new Error(`Registro de inventario (${modelo}) no encontrado para producto ${prodId}`);

        const anterior = parseFloat(registro.cantidad_actual);
        const nueva = tipo_movimiento === 'salida' || tipo_movimiento === 'nota_credito'
          ? anterior - cant
          : anterior + cant;

        if (nueva < 0) throw new Error(`Stock insuficiente en inventario ${modelo}. Actual: ${anterior}, solicitado: ${cant}`);

        await tx[modelo].update({
          where: { [campo_id]: prodId },
          data: { cantidad_actual: nueva, fecha_actualizacion: new Date() }
        });

        await tx.movimientoInventario.create({
          data: {
            id_producto: prodId,
            tipo_movimiento,
            tipo_inventario: modelo === 'inventarioGeneral' ? 'general' : 'legal',
            cantidad: cant,
            cantidad_anterior: anterior,
            cantidad_nueva: nueva,
            id_usuario,
            observacion,
            id_origen,
            id_origen_tipo,
          }
        });
      };

      if (tipo_inventario === 'general' || tipo_inventario === 'ambos') {
        await ajustar('inventarioGeneral', 'id_producto');
      }
      if (tipo_inventario === 'legal' || tipo_inventario === 'ambos') {
        await ajustar('inventarioLegal', 'id_producto');
      }
    });
  }

  async getInventario(id_producto) {
    const [general, legal] = await Promise.all([
      this.prisma.inventarioGeneral.findUnique({ where: { id_producto: parseInt(id_producto) }, include: { moneda: true } }),
      this.prisma.inventarioLegal.findUnique({ where: { id_producto: parseInt(id_producto) }, include: { moneda: true } }),
    ]);
    return { general, legal };
  }

  async listMovimientos({ id_producto, tipo_inventario, page = 1, limit = 30 } = {}) {
    const skip = (page - 1) * limit;
    const where = {
      ...(id_producto ? { id_producto: parseInt(id_producto) } : {}),
      ...(tipo_inventario ? { tipo_inventario } : {})
    };
    const [movimientos, total] = await this.prisma.$transaction([
      this.prisma.movimientoInventario.findMany({
        where, skip, take: limit,
        orderBy: { fecha: 'desc' },
        include: { producto: { select: { nombre: true } }, usuario: { select: { nombre: true } } }
      }),
      this.prisma.movimientoInventario.count({ where })
    ]);
    return { data: movimientos, total, page, totalPages: Math.ceil(total / limit) };
  }
}
