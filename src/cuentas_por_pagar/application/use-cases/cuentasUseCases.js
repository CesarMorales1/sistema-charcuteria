// ── Factura Use Cases ──────────────────────────────────────────
export class CreateFacturaUseCase {
  constructor(facturaRepository) { this.r = facturaRepository; }
  async execute(data) { return this.r.save(data); }
}

export class ListFacturasUseCase {
  constructor(facturaRepository) { this.r = facturaRepository; }
  async execute(opts) { return this.r.findAll(opts); }
}

export class GetFacturaUseCase {
  constructor(facturaRepository) { this.r = facturaRepository; }
  async execute(id) {
    const f = await this.r.findById(id);
    if (!f) throw new Error('Factura no encontrada');
    return f;
  }
}

export class DeleteFacturaUseCase {
  constructor(facturaRepository) { this.r = facturaRepository; }
  async execute(id) {
    const f = await this.r.findById(id);
    if (!f) throw new Error('Factura no encontrada');
    if (f.pagos && f.pagos.length > 0) throw new Error('No se puede eliminar una factura con pagos registrados');
    await this.r.softDelete(id);
  }
}

// ── Pago Use Cases ─────────────────────────────────────────────
export class RegistrarPagoUseCase {
  constructor(pagoRepository, facturaRepository) {
    this.pagoRepo = pagoRepository;
    this.facturaRepo = facturaRepository;
  }
  async execute(data) {
    // Verificar la factura primero
    const factura = await this.facturaRepo.findById(data.id_factura);
    if (!factura) throw new Error('Factura no encontrada');
    return this.pagoRepo.save(data, this.facturaRepo);
  }
}

export class ListPagosPorFacturaUseCase {
  constructor(pagoRepository) { this.r = pagoRepository; }
  async execute(id_factura) { return this.r.findByFactura(id_factura); }
}

export class SaldoPendienteUseCase {
  constructor(facturaRepository, pagoRepository) {
    this.facturaRepo = facturaRepository;
    this.pagoRepo = pagoRepository;
  }
  async execute(id_factura) {
    const factura = await this.facturaRepo.findById(id_factura);
    if (!factura) throw new Error('Factura no encontrada');
    const totalPagado = await this.pagoRepo.totalPagado(id_factura);
    const saldo = parseFloat(factura.monto_total) - totalPagado;
    return { factura, totalPagado, saldo, estado: factura.estado };
  }
}
