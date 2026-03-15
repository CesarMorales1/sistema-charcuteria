export class NotaCreditoService {
  constructor(crearNotaCreditoUseCase, notaCreditoRepository) {
    this.crearNotaCreditoUseCase = crearNotaCreditoUseCase;
    this.notaCreditoRepository = notaCreditoRepository;
  }

  async crearNotaCredito(notaCreditoData) {
  }

  async obtenerNotasCredito(filtros) {
  }

  async obtenerNotaCreditoPorId(id) {
  }

  async obtenerNotasCreditoPorCompra(idCompra) {
  }
}
