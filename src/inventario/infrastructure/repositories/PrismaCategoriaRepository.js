import { CategoriaProducto } from '../../domain/entities/CategoriaProducto.js';

export class PrismaCategoriaRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  _toDomain(c) {
    if (!c) return null;
    return new CategoriaProducto(c);
  }

  async findAll({ soloActivos = true } = {}) {
    const where = soloActivos ? { activo: true } : {};
    const categorias = await this.prisma.categoriaProducto.findMany({
      where,
      orderBy: { nombre: 'asc' },
    });
    return categorias.map(c => this._toDomain(c));
  }

  async findById(id) {
    const c = await this.prisma.categoriaProducto.findUnique({
      where: { id_categoria: parseInt(id) },
    });
    return this._toDomain(c);
  }

  async save({ nombre, descripcion }) {
    const created = await this.prisma.categoriaProducto.create({
      data: { nombre, descripcion },
    });
    return this._toDomain(created);
  }

  async update(id, { nombre, descripcion, activo }) {
    const updated = await this.prisma.categoriaProducto.update({
      where: { id_categoria: parseInt(id) },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(descripcion !== undefined && { descripcion }),
        ...(activo !== undefined && { activo }),
      },
    });
    return this._toDomain(updated);
  }

  async softDelete(id) {
    await this.prisma.categoriaProducto.update({
      where: { id_categoria: parseInt(id) },
      data: { activo: false },
    });
  }
}
