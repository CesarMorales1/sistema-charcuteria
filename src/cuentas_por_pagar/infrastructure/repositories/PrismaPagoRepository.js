import { IPagoRepository } from '../../domain/repositories/IPagoRepository.js';

export class PrismaPagoRepository extends IPagoRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  async findAll(filtros) {
  }

  async findById(id) {
  }

  async findByFactura(facturaId) {
  }

  async create(pagoData) {
  }

  async calcularTotalPagado(facturaId) {
  }
}
