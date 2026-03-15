export class FacturaRepository {
  async save(factura) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async findAll({ page, limit, id_proveedor, estado, vencidas } = {}) { throw new Error('Not implemented'); }
  async softDelete(id) { throw new Error('Not implemented'); }
  async recalcularEstado(id_factura, tx) { throw new Error('Not implemented'); }
}
