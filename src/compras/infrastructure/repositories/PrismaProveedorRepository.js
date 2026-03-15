import { ProveedorRepository } from '../../domain/repositories/ProveedorRepository.js';
import { Proveedor } from '../../domain/entities/Proveedor.js';

export class PrismaProveedorRepository extends ProveedorRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  _toDomain(p) {
    if (!p) return null;
    return new Proveedor({
      id_proveedor: p.id_proveedor,
      nombre: p.nombre,
      ruc: p.ruc,
      telefono: p.telefono,
      email: p.email,
      direccion: p.direccion,
      terminos_pago: p.terminos_pago,
      activo: p.activo,
    });
  }

  async save(proveedor) {
    const created = await this.prisma.proveedor.create({
      data: {
        nombre: proveedor.nombre,
        ruc: proveedor.ruc,
        telefono: proveedor.telefono,
        email: proveedor.email,
        direccion: proveedor.direccion,
        terminos_pago: proveedor.terminos_pago,
        activo: true,
      }
    });
    return this._toDomain(created);
  }

  async findById(id) {
    const p = await this.prisma.proveedor.findUnique({ where: { id_proveedor: parseInt(id) } });
    return this._toDomain(p);
  }

  async findAll({ page = 1, limit = 20, search = '', soloActivos = true } = {}) {
    const skip = (page - 1) * limit;
    const where = {
      ...(soloActivos ? { activo: true } : {}),
      ...(search ? {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { ruc: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ]
      } : {})
    };

    const [proveedores, total] = await this.prisma.$transaction([
      this.prisma.proveedor.findMany({ where, skip, take: limit, orderBy: { nombre: 'asc' } }),
      this.prisma.proveedor.count({ where })
    ]);

    return {
      data: proveedores.map(p => this._toDomain(p)),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async update(proveedor) {
    const updated = await this.prisma.proveedor.update({
      where: { id_proveedor: proveedor.id_proveedor },
      data: {
        nombre: proveedor.nombre,
        ruc: proveedor.ruc,
        telefono: proveedor.telefono,
        email: proveedor.email,
        direccion: proveedor.direccion,
        terminos_pago: proveedor.terminos_pago,
        activo: proveedor.activo,
      }
    });
    return this._toDomain(updated);
  }

  async softDelete(id) {
    await this.prisma.proveedor.update({
      where: { id_proveedor: parseInt(id) },
      data: { activo: false }
    });
  }
}
