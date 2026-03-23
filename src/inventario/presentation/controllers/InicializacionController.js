export class InicializacionController {
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  async getEstado(req, res, next) {
    try {
      const inicializado = await this.productoRepository.isInventarioInicializado();
      res.json({ success: true, data: { inicializado } });
    } catch (error) {
      next(error);
    }
  }

  async inicializar(req, res, next) {
    try {
      const { productos } = req.body;
      const idUsuario = req.user.id_usuario;

      await this.productoRepository.inicializarInventario(productos, idUsuario);
      
      res.json({ success: true, message: 'Inventario inicializado correctamente' });
    } catch (error) {
      next(error);
    }
  }
}
