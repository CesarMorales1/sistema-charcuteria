export class PagoService {
  constructor(registrarPagoUseCase, pagoRepository) {
    this.registrarPagoUseCase = registrarPagoUseCase;
    this.pagoRepository = pagoRepository;
  }

  async registrarPago(pagoData) {
  }

  async obtenerPagos(filtros) {
  }

  async obtenerPagoPorId(id) {
  }

  async obtenerPagosPorFactura(facturaId) {
  }

  async calcularTotalPagado(facturaId) {
  }
}
