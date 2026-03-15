import { ICompraRepository } from '../../domain/repositories/ICompraRepository.js';

export class PrismaCompraRepository extends ICompraRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  async findAll(filtros) {
  }

  async findById(id) {
  }

  async create(compraData, detalles) {
  }

  async update(id, compraData) {
  }

  async delete(id) {
  }

  async findReportablesSeniat() {
  }
}
