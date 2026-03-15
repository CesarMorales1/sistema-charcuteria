import bcrypt from 'bcryptjs';
import { Usuario } from '../../domain/entities/Usuario.js';

export class CreateUsuarioUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(usuarioData) {
    const existingUser = await this.usuarioRepository.findByEmail(usuarioData.email);
    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(usuarioData.password, 10);
    
    const nuevoUsuario = new Usuario({
      ...usuarioData,
      password: hashedPassword
    });

    const userCreated = await this.usuarioRepository.save(nuevoUsuario);
    return userCreated;
  }
}
