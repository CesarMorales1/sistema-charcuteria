export class IUsuarioRepository {
  async findAll() {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findByEmail(email) {
    throw new Error('Method not implemented');
  }

  async findWithPermisos(id) {
    throw new Error('Method not implemented');
  }

  async create(usuario) {
    throw new Error('Method not implemented');
  }

  async update(id, usuario) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }

  async asignarPermiso(usuarioId, permisoId) {
    throw new Error('Method not implemented');
  }

  async removerPermiso(usuarioId, permisoId) {
    throw new Error('Method not implemented');
  }
}
