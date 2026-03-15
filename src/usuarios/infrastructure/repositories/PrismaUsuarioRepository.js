import { UsuarioRepository } from '../../domain/repositories/UsuarioRepository.js';
import { Usuario } from '../../domain/entities/Usuario.js';

export class PrismaUsuarioRepository extends UsuarioRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  // Mapeador de Prisma al Modelo de Dominio
  _toDomain(prismaUser) {
    if (!prismaUser) return null;
    
    // Almacenar IDs numéricos en vez de nombres (evita errores de tipeo)
    const permisosIds = prismaUser.permisos 
      ? prismaUser.permisos.map(up => up.permiso.id_permiso) 
      : [];

    return new Usuario({
      id_usuario: prismaUser.id_usuario,
      nombre: prismaUser.nombre,
      email: prismaUser.email,
      password: prismaUser.password,
      rol: prismaUser.rol,
      activo: prismaUser.activo,
      fecha_creacion: prismaUser.fecha_creacion,
      permisos: permisosIds,
    });
  }

  async save(usuario) {
    const created = await this.prisma.usuario.create({
      data: {
        nombre: usuario.nombre,
        email: usuario.email,
        password: usuario.password,
        rol: usuario.rol,
        activo: usuario.activo,
      },
      include: { permisos: { include: { permiso: true } } }
    });
    return this._toDomain(created);
  }

  async findById(id) {
    const user = await this.prisma.usuario.findUnique({
      where: { id_usuario: parseInt(id) },
      include: { permisos: { include: { permiso: true } } }
    });
    return this._toDomain(user);
  }

  async findByEmail(email) {
    const user = await this.prisma.usuario.findUnique({
      where: { email },
      include: { permisos: { include: { permiso: true } } }
    });
    return this._toDomain(user);
  }

  async findAll({ skip = 0, take = 10, search = '' } = {}) {
    const where = search 
      ? { OR: [{ nombre: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }] } 
      : {};

    const [total, users] = await this.prisma.$transaction([
      this.prisma.usuario.count({ where }),
      this.prisma.usuario.findMany({
        where,
        skip,
        take,
        orderBy: { id_usuario: 'desc' },
        include: { permisos: { include: { permiso: true } } }
      })
    ]);

    return {
      total,
      data: users.map(u => this._toDomain(u))
    };
  }

  async update(usuario) {
    const updated = await this.prisma.usuario.update({
      where: { id_usuario: usuario.id_usuario },
      data: {
        nombre: usuario.nombre,
        email: usuario.email,
        password: usuario.password,
        rol: usuario.rol,
        activo: usuario.activo,
      },
      include: { permisos: { include: { permiso: true } } }
    });
    return this._toDomain(updated);
  }

  async softDelete(id) {
    const deleted = await this.prisma.usuario.update({
      where: { id_usuario: parseInt(id) },
      data: { activo: false }
    });
    return this._toDomain(deleted);
  }

  async assignPermissions(id_usuario, permisosIds) {
    await this.prisma.usuarioPermiso.deleteMany({
      where: { id_usuario: parseInt(id_usuario) }
    });

    if (permisosIds && permisosIds.length > 0) {
      const dataToInsert = permisosIds.map(permisoId => ({
        id_usuario: parseInt(id_usuario),
        id_permiso: parseInt(permisoId)
      }));

      await this.prisma.usuarioPermiso.createMany({
        data: dataToInsert,
        skipDuplicates: true
      });
    }
  }
}

