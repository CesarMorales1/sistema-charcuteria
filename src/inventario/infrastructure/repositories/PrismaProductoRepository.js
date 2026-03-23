import { ProductoRepository } from '../../domain/repositories/ProductoRepository.js';
import { Producto } from '../../domain/entities/Producto.js';
import { Prisma } from '@prisma/client';

const INCLUDE_PRODUCTO = {
  categoria: true,
  unidad_medida: true,
  inventario_general: true,
  inventario_legal: true,
};

export class PrismaProductoRepository extends ProductoRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  _toDomain(p) {
    if (!p) return null;
    return new Producto({
      id_producto: p.id_producto,
      codigo_barra: p.codigo_barra,
      nombre: p.nombre,
      descripcion: p.descripcion,
      id_categoria: p.id_categoria,
      categoria: p.categoria ?? null,
      id_unidad_medida: p.id_unidad_medida,
      unidad_medida: p.unidad_medida ?? null,
      id_moneda_precio: p.id_moneda_precio,
      precio_base: p.precio_base,
      peso_unitario: p.peso_unitario,
      activo: p.activo,
      inventario_general: p.inventario_general ?? null,
      inventario_legal: p.inventario_legal ?? null,
    });
  }

  async save(producto) {
    const idCategoria = parseInt(producto.id_categoria);
    const idUnidad = parseInt(producto.id_unidad_medida);

    if (!Number.isInteger(idCategoria) || idCategoria < 1) {
      throw new Error('id_categoria es requerido y debe ser un número entero válido');
    }
    if (!Number.isInteger(idUnidad) || idUnidad < 1) {
      throw new Error('id_unidad_medida es requerido y debe ser un número entero válido');
    }

    if (!producto.codigo_barra) {
      throw new Error('El código de barras es requerido');
    }

    try {
      const created = await this.prisma.$transaction(async (tx) => {
        const prod = await tx.producto.create({
          data: {
            codigo_barra: String(producto.codigo_barra).trim(),
            nombre: producto.nombre,
            descripcion: producto.descripcion ?? null,
            id_categoria: idCategoria,
            id_unidad_medida: idUnidad,
            id_moneda_precio: producto.id_moneda_precio,
            precio_base: producto.precio_base,
            peso_unitario: producto.peso_unitario ?? null,
            activo: true,
          }
        });
        await tx.inventarioGeneral.create({
          data: { id_producto: prod.id_producto, cantidad_actual: 0 }
        });
        await tx.inventarioLegal.create({
          data: { id_producto: prod.id_producto, cantidad_actual: 0 }
        });
        return prod;
      });
      return this.findById(created.id_producto);
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('codigo_barra')) {
        throw new Error('El código de barras ya existe en el sistema');
      }
      throw error;
    }
  }

  async findById(id) {
    const p = await this.prisma.producto.findUnique({
      where: { id_producto: parseInt(id) },
      include: INCLUDE_PRODUCTO,
    });
    return this._toDomain(p);
  }

  async findAll({ page = 1, limit = 20, search = '', id_categoria = null, soloActivos = true, stock_bajo = false, diferencias = false } = {}) {
    const skip = (page - 1) * limit;
    const where = {
      ...(soloActivos !== false ? { activo: true } : {}),
      ...(search ? {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { codigo_barra: { contains: search, mode: 'insensitive' } },
        ]
      } : {}),
      ...(id_categoria ? { id_categoria: parseInt(id_categoria) } : {}),
    };

    // Filtro por stock bajo
    if (stock_bajo === 'true' || stock_bajo === true) {
      where.inventario_general = { cantidad_actual: { lt: 5 } };
    }

    // Filtro por diferencias (requiere lógica especial en Prisma)
    if (diferencias === 'true' || diferencias === true) {
      const diffIds = await this.prisma.$queryRaw`
        SELECT g.id_producto 
        FROM inventario_general g
        JOIN inventario_legal l ON g.id_producto = l.id_producto
        WHERE g.cantidad_actual <> l.cantidad_actual
      `;
      where.id_producto = { in: diffIds.map(row => row.id_producto) };
    }

    // Estadísticas globales (basadas en el filtro base 'where' sin los filtros de stock/diff específicos)
    const baseWhere = {
      ...(soloActivos !== false ? { activo: true } : {}),
      ...(search ? {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { codigo_barra: { contains: search, mode: 'insensitive' } },
        ]
      } : {}),
      ...(id_categoria ? { id_categoria: parseInt(id_categoria) } : {}),
    };

    const [productos, total, totalStockBajo, rawDiffCount] = await this.prisma.$transaction([
      this.prisma.producto.findMany({
        where, skip, take: limit,
        orderBy: { nombre: 'asc' },
        include: INCLUDE_PRODUCTO,
      }),
      this.prisma.producto.count({ where }),
      this.prisma.producto.count({
        where: { ...baseWhere, inventario_general: { cantidad_actual: { lt: 5 } } }
      }),
      this.prisma.$queryRaw`
        SELECT COUNT(g.id_producto)::int as count
        FROM inventario_general g
        JOIN inventario_legal l ON g.id_producto = l.id_producto
        JOIN producto p ON g.id_producto = p.id_producto
        WHERE g.cantidad_actual <> l.cantidad_actual
        AND p.activo = true
        ${id_categoria ? Prisma.sql`AND p.id_categoria = ${parseInt(id_categoria)}` : Prisma.empty}
        ${search ? Prisma.sql`AND (p.nombre ILIKE ${'%' + search + '%'} OR p.codigo_barra ILIKE ${'%' + search + '%'})` : Prisma.empty}
      `
    ]);

    return {
      data: productos.map(p => this._toDomain(p)),
      total, page,
      totalPages: Math.ceil(total / limit),
      stats: {
        totalStockBajo,
        totalDiferencias: rawDiffCount[0]?.count || 0
      }
    };
  }

  async update(producto) {
    const updated = await this.prisma.producto.update({
      where: { id_producto: producto.id_producto },
      data: {
        ...(producto.codigo_barra !== undefined && { codigo_barra: producto.codigo_barra }),
        ...(producto.nombre !== undefined && { nombre: producto.nombre }),
        ...(producto.descripcion !== undefined && { descripcion: producto.descripcion }),
        ...(producto.id_categoria !== undefined && { id_categoria: parseInt(producto.id_categoria) }),
        ...(producto.id_unidad_medida !== undefined && { id_unidad_medida: parseInt(producto.id_unidad_medida) }),
        ...(producto.id_moneda_precio !== undefined && { id_moneda_precio: producto.id_moneda_precio ? parseInt(producto.id_moneda_precio) : null }),
        ...(producto.peso_unitario !== undefined && { peso_unitario: producto.peso_unitario }),
        ...(producto.activo !== undefined && { activo: producto.activo }),
      },
      include: INCLUDE_PRODUCTO,
    });
    return this._toDomain(updated);
  }

  async softDelete(id) {
    await this.prisma.producto.update({
      where: { id_producto: parseInt(id) },
      data: { activo: false }
    });
  }

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
  async inicializarInventario(productos, id_usuario) {
    const config = await this.prisma.configuracion.findUnique({
      where: { clave: 'inventario_inicializado' }
    });

    if (config && config.valor === 'true') {
      throw new Error('El inventario ya ha sido inicializado. Usa ajustes para modificaciones posteriores.');
    }

    await this.prisma.$transaction(async (tx) => {
      for (const prod of productos) {
        const prodId = parseInt(prod.id_producto);
        const cant = parseFloat(prod.cantidad);
        const valorUnitario = prod.valor_unitario ? parseFloat(prod.valor_unitario) : null;

        await tx.inventarioGeneral.update({
          where: { id_producto: prodId },
          data: { 
            cantidad_actual: cant, 
            valor_unitario: valorUnitario,
            fecha_actualizacion: new Date() 
          }
        });

        await tx.inventarioLegal.update({
          where: { id_producto: prodId },
          data: { 
            cantidad_actual: cant, 
            valor_unitario: valorUnitario,
            fecha_actualizacion: new Date() 
          }
        });

        if (cant > 0) {
          await tx.movimientoInventario.createMany({
            data: [
              {
                id_producto: prodId,
                tipo_movimiento: 'inicializacion',
                tipo_inventario: 'general',
                cantidad: cant,
                cantidad_anterior: 0,
                cantidad_nueva: cant,
                id_usuario: parseInt(id_usuario),
                observacion: 'Carga inicial de inventario'
              },
              {
                id_producto: prodId,
                tipo_movimiento: 'inicializacion',
                tipo_inventario: 'legal',
                cantidad: cant,
                cantidad_anterior: 0,
                cantidad_nueva: cant,
                id_usuario: parseInt(id_usuario),
                observacion: 'Carga inicial de inventario'
              }
            ]
          });
        }
      }

      await tx.configuracion.upsert({
        where: { clave: 'inventario_inicializado' },
        create: {
          clave: 'inventario_inicializado',
          valor: 'true',
          descripcion: 'Indica si el inventario inicial ya fue configurado'
        },
        update: { valor: 'true' }
      });
    });
  }

  async isInventarioInicializado() {
    const config = await this.prisma.configuracion.findUnique({
      where: { clave: 'inventario_inicializado' }
    });
    return config?.valor === 'true';
  }
}
