import { IMonedaRepository } from '../../domain/repositories/IMonedaRepository.js';

export class PrismaMonedaRepository extends IMonedaRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  async findAll() {
  }

  async findById(id) {
  }

  async findByCodigo(codigo) {
  }

  async findPrincipal() {
  }
}
