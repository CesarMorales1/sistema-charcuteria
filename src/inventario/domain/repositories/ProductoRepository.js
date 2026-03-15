export class ProductoRepository {
  async save(producto) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async findAll({ page, limit, search, categoria } = {}) { throw new Error('Not implemented'); }
  async update(producto) { throw new Error('Not implemented'); }
  async softDelete(id) { throw new Error('Not implemented'); }
  async ajustarInventario({ id_producto, tipo_inventario, cantidad, tipo_movimiento, id_usuario, observacion, id_origen, id_origen_tipo }) { throw new Error('Not implemented'); }
  async getInventario(id_producto) { throw new Error('Not implemented'); }
  async listMovimientos({ id_producto, tipo_inventario, page, limit } = {}) { throw new Error('Not implemented'); }
}
