import { IProductoRepository } from '../../domain/repositories/IProductoRepository.js';
import { Producto } from '../../domain/entities/Producto.js';

export class PrismaProductoRepository extends IProductoRepository {
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

  async create(productoData) {
  }

  async update(id, productoData) {
  }

  async delete(id) {
  }
}
