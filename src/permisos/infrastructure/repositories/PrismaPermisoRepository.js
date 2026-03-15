import { PermisoRepository } from '../../domain/repositories/PermisoRepository.js';
import { Permiso } from '../../domain/entities/Permiso.js';

export class PrismaPermisoRepository extends PermisoRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  _toDomain(p) {
    if (!p) return null;
    return new Permiso({
      id_permiso: p.id_permiso,
      nombre: p.nombre,
      descripcion: p.descripcion,
      modulo: p.modulo,
    });
  }

  async save(permiso) {
    const created = await this.prisma.permiso.create({
      data: {
        nombre: permiso.nombre,
        descripcion: permiso.descripcion,
        modulo: permiso.modulo,
      }
    });
    return this._toDomain(created);
  }

  async findById(id) {
    const p = await this.prisma.permiso.findUnique({ where: { id_permiso: parseInt(id) } });
    return this._toDomain(p);
  }

  async findAll() {
    const permisos = await this.prisma.permiso.findMany({
      orderBy: [{ modulo: 'asc' }, { nombre: 'asc' }]
    });
    return permisos.map(p => this._toDomain(p));
  }

  async update(permiso) {
    const updated = await this.prisma.permiso.update({
      where: { id_permiso: permiso.id_permiso },
      data: {
        nombre: permiso.nombre,
        descripcion: permiso.descripcion,
        modulo: permiso.modulo,
      }
    });
    return this._toDomain(updated);
  }

  async delete(id) {
    await this.prisma.permiso.delete({ where: { id_permiso: parseInt(id) } });
  }
}
