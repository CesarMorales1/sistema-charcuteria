import { ITipoCambioRepository } from '../../domain/repositories/ITipoCambioRepository.js';

export class PrismaTipoCambioRepository extends ITipoCambioRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  async findAll(filtros) {
  }

  async findById(id) {
  }

  async findVigente(monedaOrigenId, monedaDestinoId) {
  }

  async findHistorial(monedaOrigenId, monedaDestinoId, fechaInicio, fechaFin) {
  }

  async create(tipoCambioData) {
  }

  async update(id, tipoCambioData) {
  }
}
