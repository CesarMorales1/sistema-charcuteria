import { Proveedor } from '../../domain/entities/Proveedor.js';

export class CreateProveedorUseCase {
  constructor(proveedorRepository) {
    this.proveedorRepository = proveedorRepository;
  }

  async execute(data) {
    const proveedor = new Proveedor({
      id_proveedor: null,
      nombre: data.nombre,
      ruc: data.ruc || null,
      telefono: data.telefono || null,
      email: data.email || null,
      direccion: data.direccion || null,
      terminos_pago: data.terminos_pago || null,
    });
    return this.proveedorRepository.save(proveedor);
  }
}
