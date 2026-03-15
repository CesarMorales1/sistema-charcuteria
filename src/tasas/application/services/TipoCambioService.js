export class TipoCambioService {
  constructor(actualizarTasaUseCase, tipoCambioRepository) {
    this.actualizarTasaUseCase = actualizarTasaUseCase;
    this.tipoCambioRepository = tipoCambioRepository;
  }

  async obtenerTasas(filtros) {
  }

  async obtenerTasaPorId(id) {
  }

  async obtenerTasaVigente(monedaOrigen, monedaDestino) {
  }

  async obtenerHistorialTasas(monedaOrigen, monedaDestino, fechaInicio, fechaFin) {
  }

  async actualizarTasa(tasaData) {
  }

  async convertirMoneda(monto, monedaOrigen, monedaDestino) {
  }
}
