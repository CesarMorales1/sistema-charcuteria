import { IUsuarioRepository } from '../../domain/repositories/IUsuarioRepository.js';

export class PrismaUsuarioRepository extends IUsuarioRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  async findAll() {
  }

  async findById(id) {
  }

  async findByEmail(email) {
  }

  async findWithPermisos(id) {
  }

  async create(usuarioData) {
  }

  async update(id, usuarioData) {
  }

  async delete(id) {
  }

  async asignarPermiso(usuarioId, permisoId) {
  }

  async removerPermiso(usuarioId, permisoId) {
  }
}
