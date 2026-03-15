export class CompraRepository {
  async save(compra) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async findAll({ page, limit, id_proveedor, reportable_seniat, estado } = {}) { throw new Error('Not implemented'); }
  async updateEstado(id, estado) { throw new Error('Not implemented'); }
  async cancelar(id) { throw new Error('Not implemented'); }
}
