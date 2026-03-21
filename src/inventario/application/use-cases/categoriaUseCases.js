export class ListarCategoriasUseCase {
  constructor(repo) { this.repo = repo; }
  async execute({ soloActivos = true } = {}) {
    return this.repo.findAll({ soloActivos });
  }
}

export class GetCategoriaUseCase {
  constructor(repo) { this.repo = repo; }
  async execute(id) {
    const c = await this.repo.findById(id);
    if (!c) throw new Error('Categoría no encontrada');
    return c;
  }
}

export class CrearCategoriaUseCase {
  constructor(repo) { this.repo = repo; }
  async execute(data) {
    return this.repo.save(data);
  }
}

export class ActualizarCategoriaUseCase {
  constructor(repo) { this.repo = repo; }
  async execute(id, data) {
    const existe = await this.repo.findById(id);
    if (!existe) throw new Error('Categoría no encontrada');
    return this.repo.update(id, data);
  }
}

export class EliminarCategoriaUseCase {
  constructor(repo) { this.repo = repo; }
  async execute(id) {
    const existe = await this.repo.findById(id);
    if (!existe) throw new Error('Categoría no encontrada');
    return this.repo.softDelete(id);
  }
}
