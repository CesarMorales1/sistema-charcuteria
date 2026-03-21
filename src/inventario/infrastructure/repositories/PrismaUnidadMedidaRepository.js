import { UnidadMedida } from '../../domain/entities/UnidadMedida.js';

export class PrismaUnidadMedidaRepository {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  _toDomain(u) {
    if (!u) return null;
    return new UnidadMedida(u);
  }

  async findAll({ soloActivos = true } = {}) {
    const where = soloActivos ? { activo: true } : {};
    const unidades = await this.prisma.unidadMedida.findMany({
      where,
      orderBy: { nombre: 'asc' },
    });
    return unidades.map(u => this._toDomain(u));
  }

  async findById(id) {
    const u = await this.prisma.unidadMedida.findUnique({
      where: { id_unidad_medida: parseInt(id) },
    });
    return this._toDomain(u);
  }

  async save({ nombre, abreviatura }) {
    const created = await this.prisma.unidadMedida.create({
      data: { nombre, abreviatura },
    });
    return this._toDomain(created);
  }

  async update(id, { nombre, abreviatura, activo }) {
    const updated = await this.prisma.unidadMedida.update({
      where: { id_unidad_medida: parseInt(id) },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(abreviatura !== undefined && { abreviatura }),
        ...(activo !== undefined && { activo }),
      },
    });
    return this._toDomain(updated);
  }

  async softDelete(id) {
    await this.prisma.unidadMedida.update({
      where: { id_unidad_medida: parseInt(id) },
      data: { activo: false },
    });
  }
}
