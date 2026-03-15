export class GetProveedorUseCase {
  constructor(proveedorRepository) {
    this.proveedorRepository = proveedorRepository;
  }

  async execute(id) {
    const proveedor = await this.proveedorRepository.findById(id);
    if (!proveedor) throw new Error('Proveedor no encontrado');
    return proveedor;
  }
}
