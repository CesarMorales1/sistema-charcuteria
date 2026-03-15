export class ListProveedoresUseCase {
  constructor(proveedorRepository) {
    this.proveedorRepository = proveedorRepository;
  }

  async execute({ page = 1, limit = 20, search = '', soloActivos = true } = {}) {
    return this.proveedorRepository.findAll({ page, limit, search, soloActivos });
  }
}
