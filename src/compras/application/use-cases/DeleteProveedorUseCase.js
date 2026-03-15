export class DeleteProveedorUseCase {
  constructor(proveedorRepository) {
    this.proveedorRepository = proveedorRepository;
  }

  async execute(id) {
    const actual = await this.proveedorRepository.findById(id);
    if (!actual) throw new Error('Proveedor no encontrado');
    await this.proveedorRepository.softDelete(id);
  }
}
