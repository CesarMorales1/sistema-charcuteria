import { IInventarioRepository } from '../../domain/repositories/IInventarioRepository.js';

export class PrismaInventarioRepository extends IInventarioRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  async findByProductoId(productoId, tipo) {
  }

  async findAll(tipo) {
  }

  async actualizarCantidad(productoId, cantidad, tipo) {
  }

  async registrarMovimiento(movimiento) {
  }

  async obtenerMovimientos(productoId, filtros) {
  }
}
