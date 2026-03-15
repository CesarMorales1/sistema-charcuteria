export class CrearCompraUseCase {
  constructor(compraRepository, inventarioRepository) {
    this.compraRepository = compraRepository;
    this.inventarioRepository = inventarioRepository;
  }

  async execute(compraData) {
  }
}
