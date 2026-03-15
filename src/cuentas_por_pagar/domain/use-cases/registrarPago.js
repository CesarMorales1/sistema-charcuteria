export class RegistrarPagoUseCase {
  constructor(pagoRepository, facturaRepository) {
    this.pagoRepository = pagoRepository;
    this.facturaRepository = facturaRepository;
  }

  async execute(pagoData) {
  }
}
