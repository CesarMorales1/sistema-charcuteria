export class UsuarioService {
  constructor(crearUsuarioUseCase, usuarioRepository) {
    this.crearUsuarioUseCase = crearUsuarioUseCase;
    this.usuarioRepository = usuarioRepository;
  }

  async crearUsuario(usuarioData) {
  }

  async obtenerUsuarios() {
  }

  async obtenerUsuarioPorId(id) {
  }

  async obtenerUsuarioConPermisos(id) {
  }

  async actualizarUsuario(id, usuarioData) {
  }

  async eliminarUsuario(id) {
  }

  async asignarPermiso(usuarioId, permisoId) {
  }

  async removerPermiso(usuarioId, permisoId) {
  }
}
