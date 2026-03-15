import bcrypt from 'bcryptjs';

export class UpdateUsuarioUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(id, usuarioData) {
    const usuarioActual = await this.usuarioRepository.findById(id);
    
    if (!usuarioActual) {
      throw new Error('Usuario no encontrado');
    }

    if (usuarioData.email && usuarioData.email !== usuarioActual.email) {
      const existingEmail = await this.usuarioRepository.findByEmail(usuarioData.email);
      if (existingEmail) {
        throw new Error('El correo electrónico ya está en uso por otro usuario');
      }
    }

    // Actualizar campos
    if (usuarioData.nombre) usuarioActual.nombre = usuarioData.nombre;
    if (usuarioData.email) usuarioActual.email = usuarioData.email;
    if (usuarioData.rol) usuarioActual.cambiarRol(usuarioData.rol);
    if (usuarioData.activo !== undefined) {
      usuarioData.activo ? usuarioActual.activar() : usuarioActual.desactivar();
    }

    if (usuarioData.password) {
      usuarioActual.password = await bcrypt.hash(usuarioData.password, 10);
    }

    const updatedUser = await this.usuarioRepository.update(usuarioActual);
    return updatedUser;
  }
}
