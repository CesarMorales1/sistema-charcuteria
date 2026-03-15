import { FacturaRepository } from '../../domain/repositories/FacturaRepository.js';
import { Factura } from '../../domain/entities/Factura.js';

export class PrismaFacturaRepository extends FacturaRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  _toDomain(f) {
    if (!f) return null;
    return new Factura({
      id_factura: f.id_factura,
      id_proveedor: f.id_proveedor,
      id_compra: f.id_compra,
      numero_factura: f.numero_factura,
      fecha_emision: f.fecha_emision,
      fecha_vencimiento: f.fecha_vencimiento,
      base_imponible: f.base_imponible,
      alicuota_iva: f.alicuota_iva,
      monto_iva: f.monto_iva,
      monto_total: f.monto_total,
      id_moneda_monto: f.id_moneda_monto,
      tasa_referencia: f.tasa_referencia,
      estado: f.estado,
      eliminada: f.eliminada,
      proveedor: f.proveedor ?? null,
      pagos: f.pagos ?? [],
    });
  }

  async save(factura) {
    const base_imponible = parseFloat(factura.base_imponible);
    const alicuota = parseFloat(factura.alicuota_iva ?? 16);
    const monto_iva  = parseFloat((base_imponible * alicuota / 100).toFixed(2));
    const monto_total = parseFloat((base_imponible + monto_iva).toFixed(2));

    const created = await this.prisma.factura.create({
      data: {
        id_proveedor: factura.id_proveedor,
        id_compra: factura.id_compra ?? null,
        numero_factura: factura.numero_factura,
        fecha_emision: new Date(factura.fecha_emision),
        fecha_vencimiento: new Date(factura.fecha_vencimiento),
        base_imponible,
        alicuota_iva: alicuota,
        monto_iva,
        monto_total,
        id_moneda_monto: factura.id_moneda_monto,
        tasa_referencia: factura.tasa_referencia ?? null,
        estado: 'pendiente',
      },
      include: { proveedor: { select: { nombre: true } }, pagos: true }
    });
    return this._toDomain(created);
  }

  async findById(id) {
    const f = await this.prisma.factura.findFirst({
      where: { id_factura: parseInt(id), eliminada: false },
      include: {
        proveedor: { select: { nombre: true, ruc: true } },
        pagos: { include: { moneda: { select: { codigo: true, simbolo: true } } } },
        moneda: { select: { codigo: true, simbolo: true } },
        compra: { select: { numero_factura: true, reportable_seniat: true } }
      }
    });
    return this._toDomain(f);
  }

  async findAll({ page = 1, limit = 20, id_proveedor, estado, vencidas } = {}) {
    const skip = (page - 1) * limit;
    const hoy = new Date();
    const where = {
      eliminada: false,
      ...(id_proveedor ? { id_proveedor: parseInt(id_proveedor) } : {}),
      ...(estado ? { estado } : {}),
      ...(vencidas === 'true' ? { fecha_vencimiento: { lt: hoy }, estado: { not: 'pagada' } } : {}),
    };
    const [facturas, total] = await this.prisma.$transaction([
      this.prisma.factura.findMany({
        where, skip, take: limit,
        orderBy: { fecha_vencimiento: 'asc' },
        include: {
          proveedor: { select: { nombre: true } },
          moneda: { select: { codigo: true } },
          pagos: { select: { monto: true } }
        }
      }),
      this.prisma.factura.count({ where })
    ]);
    return { data: facturas.map(f => this._toDomain(f)), total, page, totalPages: Math.ceil(total / limit) };
  }

  async softDelete(id) {
    await this.prisma.factura.update({ where: { id_factura: parseInt(id) }, data: { eliminada: true } });
  }

  /**
   * Recalcula el estado de una factura en base al total pagado.
   * Llama dentro de la misma transacción del pago para consistencia.
   */
  async recalcularEstado(id_factura, tx = this.prisma) {
    const factura = await tx.factura.findUnique({ where: { id_factura: parseInt(id_factura) } });
    if (!factura) return;

    const pagos = await tx.pago.findMany({ where: { id_factura: parseInt(id_factura) } });
    const totalPagado = pagos.reduce((sum, p) => sum + parseFloat(p.monto), 0);
    const total = parseFloat(factura.monto_total);

    let nuevoEstado = 'pendiente';
    if (totalPagado >= total) nuevoEstado = 'pagada';
    else if (totalPagado > 0) nuevoEstado = 'parcial';

    await tx.factura.update({ where: { id_factura: parseInt(id_factura) }, data: { estado: nuevoEstado } });
    return nuevoEstado;
  }
}
