export class UpdateProveedorUseCase {
  constructor(proveedorRepository) {
    this.proveedorRepository = proveedorRepository;
  }

  async execute(id, data) {
    const actual = await this.proveedorRepository.findById(id);
    if (!actual) throw new Error('Proveedor no encontrado');

    if (data.nombre !== undefined) actual.nombre = data.nombre;
    if (data.ruc !== undefined) actual.ruc = data.ruc;
    if (data.telefono !== undefined) actual.telefono = data.telefono;
    if (data.email !== undefined) actual.email = data.email;
    if (data.direccion !== undefined) actual.direccion = data.direccion;
    if (data.terminos_pago !== undefined) actual.terminos_pago = data.terminos_pago;
    if (data.activo !== undefined) actual.activo = data.activo;

    return this.proveedorRepository.update(actual);
  }
}
