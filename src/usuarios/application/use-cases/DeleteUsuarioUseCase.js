export class DeleteUsuarioUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(id) {
    const usuarioActual = await this.usuarioRepository.findById(id);
    
    if (!usuarioActual) {
      throw new Error('Usuario no encontrado');
    }

    if (usuarioActual.email === 'admin@charcuteria.com') {
      throw new Error('No se puede eliminar al superusuario principal');
    }

    return await this.usuarioRepository.softDelete(id);
  }
}
