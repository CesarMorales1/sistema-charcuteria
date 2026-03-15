export class InventarioService {
  constructor(actualizarInventarioUseCase, inventarioRepository) {
    this.actualizarInventarioUseCase = actualizarInventarioUseCase;
    this.inventarioRepository = inventarioRepository;
  }

  async obtenerInventario(tipo) {
  }

  async obtenerInventarioProducto(productoId, tipo) {
  }

  async registrarMovimiento(movimientoData) {
  }

  async obtenerMovimientos(productoId, filtros) {
  }
}
