/**
 * Clase base abstracta para el repositorio de ventas.
 * La implementación concreta en infrastructure/repositories debe sobrescribir todos los métodos.
 */
export class VentaRepository {
  async save(venta)              { throw new Error('Not implemented: save'); }
  async findById(id)             { throw new Error('Not implemented: findById'); }
  async findAll(opts)            { throw new Error('Not implemented: findAll'); }
  async anular(id, id_usuario)   { throw new Error('Not implemented: anular'); }
}
