import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class LoginUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute({ email, password }) {
    const usuario = await this.usuarioRepository.findByEmail(email);

    if (!usuario || !usuario.activo) {
      throw new Error('Credenciales inválidas o usuario inactivo');
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password);

    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas o usuario inactivo');
    }

    // Generar Token
    const payload = {
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      rol: usuario.rol,
      permisos: usuario.permisos
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h'
    });

    return {
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        permisos: usuario.permisos
      }
    };
  }
}
