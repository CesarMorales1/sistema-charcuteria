export class DeletePermisoUseCase {
  constructor(permisoRepository) {
    this.permisoRepository = permisoRepository;
  }

  async execute(id) {
    const actual = await this.permisoRepository.findById(id);
    if (!actual) throw new Error('Permiso no encontrado');
    await this.permisoRepository.delete(id);
  }
}
