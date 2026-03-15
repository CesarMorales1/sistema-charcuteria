import { Permiso } from '../../domain/entities/Permiso.js';

export class CreatePermisoUseCase {
  constructor(permisoRepository) {
    this.permisoRepository = permisoRepository;
  }

  async execute(data) {
    const permiso = new Permiso({
      id_permiso: null,
      nombre: data.nombre,
      descripcion: data.descripcion || null,
      modulo: data.modulo || null,
    });
    return this.permisoRepository.save(permiso);
  }
}
