export class ListPermisosUseCase {
  constructor(permisoRepository) {
    this.permisoRepository = permisoRepository;
  }

  async execute() {
    return this.permisoRepository.findAll();
  }
}
