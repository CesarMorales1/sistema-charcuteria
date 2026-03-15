import { INotaCreditoRepository } from '../../domain/repositories/INotaCreditoRepository.js';

export class PrismaNotaCreditoRepository extends INotaCreditoRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  async findAll(filtros) {
  }

  async findById(id) {
  }

  async findByCompra(idCompra) {
  }

  async create(notaCreditoData) {
  }
}
