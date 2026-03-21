export class ListarUnidadesMedidaUseCase {
  constructor(repo) { this.repo = repo; }
  async execute({ soloActivos = true } = {}) {
    return this.repo.findAll({ soloActivos });
  }
}

export class GetUnidadMedidaUseCase {
  constructor(repo) { this.repo = repo; }
  async execute(id) {
    const u = await this.repo.findById(id);
    if (!u) throw new Error('Unidad de medida no encontrada');
    return u;
  }
}

export class CrearUnidadMedidaUseCase {
  constructor(repo) { this.repo = repo; }
  async execute(data) {
    return this.repo.save(data);
  }
}

export class ActualizarUnidadMedidaUseCase {
  constructor(repo) { this.repo = repo; }
  async execute(id, data) {
    const existe = await this.repo.findById(id);
    if (!existe) throw new Error('Unidad de medida no encontrada');
    return this.repo.update(id, data);
  }
}

export class EliminarUnidadMedidaUseCase {
  constructor(repo) { this.repo = repo; }
  async execute(id) {
    const existe = await this.repo.findById(id);
    if (!existe) throw new Error('Unidad de medida no encontrada');
    return this.repo.softDelete(id);
  }
}
