export class AssignPermissionsUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(id_usuario, permisosIds) {
    const usuario = await this.usuarioRepository.findById(id_usuario);
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    if (usuario.email === 'admin@charcuteria.com') {
      throw new Error('No se pueden modificar los permisos del superusuario principal');
    }

    if (!Array.isArray(permisosIds)) {
      throw new Error('Formato de permisos inválido. Debe ser un arreglo de IDs.');
    }

    await this.usuarioRepository.assignPermissions(id_usuario, permisosIds);
    return true;
  }
}
