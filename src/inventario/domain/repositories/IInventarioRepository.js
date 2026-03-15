export class IInventarioRepository {
  async findByProductoId(productoId, tipo) {
    throw new Error('Method not implemented');
  }

  async findAll(tipo) {
    throw new Error('Method not implemented');
  }

  async actualizarCantidad(productoId, cantidad, tipo) {
    throw new Error('Method not implemented');
  }

  async registrarMovimiento(movimiento) {
    throw new Error('Method not implemented');
  }

  async obtenerMovimientos(productoId, filtros) {
    throw new Error('Method not implemented');
  }
}
