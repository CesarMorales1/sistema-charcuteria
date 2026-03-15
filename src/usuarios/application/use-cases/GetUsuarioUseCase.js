export class GetUsuarioUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(id) {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    return usuario;
  }
}
