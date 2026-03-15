export class UpdatePermisoUseCase {
  constructor(permisoRepository) {
    this.permisoRepository = permisoRepository;
  }

  async execute(id, data) {
    const actual = await this.permisoRepository.findById(id);
    if (!actual) throw new Error('Permiso no encontrado');

    if (data.nombre !== undefined) actual.nombre = data.nombre;
    if (data.descripcion !== undefined) actual.descripcion = data.descripcion;
    if (data.modulo !== undefined) actual.modulo = data.modulo;

    return this.permisoRepository.update(actual);
  }
}
