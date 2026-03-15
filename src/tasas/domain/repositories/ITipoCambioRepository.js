export class ITipoCambioRepository {
  async findAll(filtros) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findVigente(monedaOrigenId, monedaDestinoId) {
    throw new Error('Method not implemented');
  }

  async findHistorial(monedaOrigenId, monedaDestinoId, fechaInicio, fechaFin) {
    throw new Error('Method not implemented');
  }

  async create(tipoCambio) {
    throw new Error('Method not implemented');
  }

  async update(id, tipoCambio) {
    throw new Error('Method not implemented');
  }
}
