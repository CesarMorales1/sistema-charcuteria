import { IFacturaRepository } from '../../domain/repositories/IFacturaRepository.js';

export class PrismaFacturaRepository extends IFacturaRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  async findAll(filtros) {
  }

  async findById(id) {
  }

  async findByProveedor(proveedorId) {
  }

  async findVencidas() {
  }

  async create(facturaData) {
  }

  async update(id, facturaData) {
  }

  async softDelete(id) {
  }
}
