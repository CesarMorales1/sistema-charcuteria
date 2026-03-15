import { IAuditoriaRepository } from '../../domain/repositories/IAuditoriaRepository.js';

export class PrismaAuditoriaRepository extends IAuditoriaRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  async findAll(filtros) {
  }

  async findById(id) {
  }

  async findByUsuario(usuarioId, filtros) {
  }

  async findByTabla(tabla, idRegistro) {
  }

  async create(auditoriaData) {
  }
}
