import { validationResult } from 'express-validator';

export class PermisoController {
  constructor(createUseCase, listUseCase, updateUseCase, deleteUseCase) {
    this.createUseCase = createUseCase;
    this.listUseCase = listUseCase;
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
      const permisos = await this.listUseCase.execute();
      res.json({ status: 'success', data: permisos });
    } catch (error) { next(error); }
  };

  crear = async (req, res, next) => {
    if (this._validar(req, res)) return;
    try {
      const permiso = await this.createUseCase.execute(req.body);
      res.status(201).json({ status: 'success', data: permiso });
    } catch (error) { next(error); }
  };

  actualizar = async (req, res, next) => {
    if (this._validar(req, res)) return;
    try {
      const permiso = await this.updateUseCase.execute(req.params.id, req.body);
      res.json({ status: 'success', data: permiso });
    } catch (error) {
      if (error.message === 'Permiso no encontrado') return res.status(404).json({ status: 'error', message: error.message });
      next(error);
    }
  };

  eliminar = async (req, res, next) => {
    try {
      await this.deleteUseCase.execute(req.params.id);
      res.json({ status: 'success', message: 'Permiso eliminado' });
    } catch (error) {
      if (error.message === 'Permiso no encontrado') return res.status(404).json({ status: 'error', message: error.message });
      next(error);
    }
  };
}
