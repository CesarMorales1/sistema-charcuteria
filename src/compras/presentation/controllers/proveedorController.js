import { validationResult } from 'express-validator';

export class ProveedorController {
  constructor(createUseCase, listUseCase, getUseCase, updateUseCase, deleteUseCase) {
    this.createUseCase = createUseCase;
    this.listUseCase = listUseCase;
    this.getUseCase = getUseCase;
    this.updateUseCase = updateUseCase;
    this.deleteUseCase = deleteUseCase;
  }

  _validar(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ status: 'error', errors: errors.array() });
      return true;
    }
    return false;
  }

  listar = async (req, res, next) => {
    try {
      const { page = 1, limit = 20, search = '', soloActivos = 'true' } = req.query;
      const result = await this.listUseCase.execute({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        soloActivos: soloActivos === 'true'
      });
      res.json({ status: 'success', ...result });
    } catch (error) { next(error); }
  };

  obtenerPorId = async (req, res, next) => {
    try {
      const proveedor = await this.getUseCase.execute(req.params.id);
      res.json({ status: 'success', data: proveedor });
    } catch (error) {
      if (error.message === 'Proveedor no encontrado') return res.status(404).json({ status: 'error', message: error.message });
      next(error);
    }
  };

  crear = async (req, res, next) => {
    if (this._validar(req, res)) return;
    try {
      const proveedor = await this.createUseCase.execute(req.body);
      res.status(201).json({ status: 'success', data: proveedor });
    } catch (error) { next(error); }
  };

  actualizar = async (req, res, next) => {
    if (this._validar(req, res)) return;
    try {
      const proveedor = await this.updateUseCase.execute(req.params.id, req.body);
      res.json({ status: 'success', data: proveedor });
    } catch (error) {
      if (error.message === 'Proveedor no encontrado') return res.status(404).json({ status: 'error', message: error.message });
      next(error);
    }
  };

  eliminar = async (req, res, next) => {
    try {
      await this.deleteUseCase.execute(req.params.id);
      res.json({ status: 'success', message: 'Proveedor desactivado correctamente' });
    } catch (error) {
      if (error.message === 'Proveedor no encontrado') return res.status(404).json({ status: 'error', message: error.message });
      next(error);
    }
  };
}
