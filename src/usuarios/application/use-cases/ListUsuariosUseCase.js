export class ListUsuariosUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(params) {
    return this.usuarioRepository.findAll(params);
  }
}
