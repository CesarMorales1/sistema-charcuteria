export class CrearNotaCreditoUseCase {
  constructor(notaCreditoRepository, inventarioRepository) {
    this.notaCreditoRepository = notaCreditoRepository;
    this.inventarioRepository = inventarioRepository;
  }

  async execute(notaCreditoData) {
  }
}
