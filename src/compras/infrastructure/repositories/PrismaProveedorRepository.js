import { IProveedorRepository } from '../../domain/repositories/IProveedorRepository.js';

export class PrismaProveedorRepository extends IProveedorRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  async findAll() {
  }

  async findById(id) {
  }

  async create(proveedorData) {
  }

  async update(id, proveedorData) {
  }

  async delete(id) {
  }
}
