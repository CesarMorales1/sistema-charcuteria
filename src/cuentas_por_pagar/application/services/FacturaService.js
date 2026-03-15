export class FacturaService {
  constructor(crearFacturaUseCase, facturaRepository) {
    this.crearFacturaUseCase = crearFacturaUseCase;
    this.facturaRepository = facturaRepository;
  }

  async crearFactura(facturaData) {
  }

  async obtenerFacturas(filtros) {
  }

  async obtenerFacturaPorId(id) {
  }

  async obtenerFacturasPorProveedor(proveedorId) {
  }

  async obtenerFacturasVencidas() {
  }

  async actualizarFactura(id, facturaData) {
  }

  async eliminarFactura(id) {
  }
}
