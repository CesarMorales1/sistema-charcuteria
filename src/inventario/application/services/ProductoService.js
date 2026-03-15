export class ProductoService {
  constructor(crearProductoUseCase, productoRepository) {
    this.crearProductoUseCase = crearProductoUseCase;
    this.productoRepository = productoRepository;
  }

  async crearProducto(productoData) {
  }

  async obtenerProductos() {
  }

  async obtenerProductoPorId(id) {
  }

  async actualizarProducto(id, productoData) {
  }

  async eliminarProducto(id) {
  }
}
