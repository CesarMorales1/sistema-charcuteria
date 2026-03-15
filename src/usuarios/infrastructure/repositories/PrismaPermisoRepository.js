import { IPermisoRepository } from '../../domain/repositories/IPermisoRepository.js';

export class PrismaPermisoRepository extends IPermisoRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  async findAll() {
  }

  async findById(id) {
  }

  async findByNombre(nombre) {
  }

  async findByModulo(modulo) {
  }

  async findByUsuario(usuarioId) {
  }
}
