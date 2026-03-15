export class CompraService {
  constructor(crearCompraUseCase, compraRepository) {
    this.crearCompraUseCase = crearCompraUseCase;
    this.compraRepository = compraRepository;
  }

  async crearCompra(compraData) {
  }

  async obtenerCompras(filtros) {
  }

  async obtenerCompraPorId(id) {
  }

  async actualizarCompra(id, compraData) {
  }

  async obtenerComprasReportablesSeniat() {
  }
}
