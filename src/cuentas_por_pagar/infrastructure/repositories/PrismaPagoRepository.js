import { PagoRepository } from '../../domain/repositories/PagoRepository.js';
import { Pago } from '../../domain/entities/Pago.js';

export class PrismaPagoRepository extends PagoRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  _toDomain(p) {
    if (!p) return null;
    return new Pago({
      id_pago: p.id_pago,
      id_factura: p.id_factura,
      fecha_pago: p.fecha_pago,
      monto: p.monto,
      id_moneda: p.id_moneda,
      tasa_pago: p.tasa_pago,
      metodo_pago: p.metodo_pago,
      referencia: p.referencia,
      moneda: p.moneda ?? null,
    });
  }

  /** Registra el pago y recalcula el estado de la factura en una transacción. */
  async save(pago, facturaRepository) {
    return this.prisma.$transaction(async (tx) => {
      // Verificar que la factura existe y no está pagada ni eliminada
      const factura = await tx.factura.findFirst({
        where: { id_factura: parseInt(pago.id_factura), eliminada: false }
      });
      if (!factura) throw new Error('Factura no encontrada');
      if (factura.estado === 'pagada') throw new Error('La factura ya está completamente pagada');

      const pagosExistentes = await tx.pago.findMany({ where: { id_factura: parseInt(pago.id_factura) } });
      const totalPrevio = pagosExistentes.reduce((sum, p) => sum + parseFloat(p.monto), 0);
      const montoNuevo  = parseFloat(pago.monto);
      const totalNuevo  = totalPrevio + montoNuevo;
      const totalFactura = parseFloat(factura.monto_total);

      if (totalNuevo > totalFactura) {
        throw new Error(`El pago de ${montoNuevo} supera el saldo pendiente de ${(totalFactura - totalPrevio).toFixed(2)}`);
      }

      const created = await tx.pago.create({
        data: {
          id_factura: parseInt(pago.id_factura),
          monto: montoNuevo,
          id_moneda: pago.id_moneda,
          tasa_pago: pago.tasa_pago ?? null,
          metodo_pago: pago.metodo_pago,
          referencia: pago.referencia ?? null,
        },
        include: { moneda: { select: { codigo: true, simbolo: true } } }
      });

      // Recalcular estado de la factura dentro de la misma transacción
      await facturaRepository.recalcularEstado(pago.id_factura, tx);

      return this._toDomain(created);
    });
  }

  async findByFactura(id_factura) {
    const pagos = await this.prisma.pago.findMany({
      where: { id_factura: parseInt(id_factura) },
      orderBy: { fecha_pago: 'asc' },
      include: { moneda: { select: { codigo: true, simbolo: true } } }
    });
    return pagos.map(p => this._toDomain(p));
  }

  async totalPagado(id_factura) {
    const r = await this.prisma.pago.aggregate({
      where: { id_factura: parseInt(id_factura) },
      _sum: { monto: true }
    });
    return parseFloat(r._sum.monto ?? 0);
  }
}
