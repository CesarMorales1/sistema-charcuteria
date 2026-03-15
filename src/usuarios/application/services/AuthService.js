export class AuthService {
  constructor(autenticarUsuarioUseCase, usuarioRepository) {
    this.autenticarUsuarioUseCase = autenticarUsuarioUseCase;
    this.usuarioRepository = usuarioRepository;
  }

  async login(email, password) {
  }

  async validarToken(token) {
  }

  async obtenerUsuarioActual(usuarioId) {
  }
}
