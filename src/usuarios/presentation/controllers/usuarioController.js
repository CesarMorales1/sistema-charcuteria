import { validationResult } from 'express-validator';

export class UsuarioController {
  constructor(
    createUseCase,
    getUseCase,
    listUseCase,
    updateUseCase,
    deleteUseCase,
    assignPermissionsUseCase
  ) {
    this.createUseCase = createUseCase;
    this.getUseCase = getUseCase;
    this.listUseCase = listUseCase;
    this.updateUseCase = updateUseCase;
    this.deleteUseCase = deleteUseCase;
    this.assignPermissionsUseCase = assignPermissionsUseCase;
  }

  // Helpers
  _handleValidationErrors(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ status: 'error', errors: errors.array() });
      return true; // Hay errores
    }
    return false; // No hay errores
  }

  crearUsuario = async (req, res, next) => {
    if (this._handleValidationErrors(req, res)) return;

    try {
      const userCreated = await this.createUseCase.execute(req.body);
      // Evitar responder con el hash del password
      const { password, ...safeUser } = userCreated;
      res.status(201).json({ status: 'success', data: safeUser });
    } catch (error) {
      if (error.message.includes('correo electrónico ya está')) {
        return res.status(400).json({ status: 'error', message: error.message });
      }
      next(error);
    }
  }

  obtenerUsuarios = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const result = await this.listUseCase.execute({ skip, take, search });
      
      // Sanitizar contraseñas
      const safeData = result.data.map(u => {
        const { password, ...rest } = u;
        return rest;
      });

      res.json({
        status: 'success',
        data: safeData,
        meta: {
          total: result.total,
          page: Number(page),
          totalPages: Math.ceil(result.total / take)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  obtenerUsuarioPorId = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await this.getUseCase.execute(id);
      const { password, ...safeUser } = user;
      res.json({ status: 'success', data: safeUser });
    } catch (error) {
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({ status: 'error', message: error.message });
      }
      next(error);
    }
  }

  actualizarUsuario = async (req, res, next) => {
    if (this._handleValidationErrors(req, res)) return;

    try {
      const { id } = req.params;
      const userUpdated = await this.updateUseCase.execute(id, req.body);
      const { password, ...safeUser } = userUpdated;
      
      res.json({ status: 'success', data: safeUser });
    } catch (error) {
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({ status: 'error', message: error.message });
      }
      if (error.message.includes('correo electrónico ya está')) {
        return res.status(400).json({ status: 'error', message: error.message });
      }
      next(error);
    }
  }

  eliminarUsuario = async (req, res, next) => {
    try {
      const { id } = req.params;
      await this.deleteUseCase.execute(id);
      res.json({ status: 'success', message: 'Usuario desactivado exitosamente (Soft-Delete)' });
    } catch (error) {
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({ status: 'error', message: error.message });
      }
      if (error.message.includes('superusuario principal')) {
        return res.status(403).json({ status: 'error', message: error.message });
      }
      next(error);
    }
  }

  asignarPermisos = async (req, res, next) => {
    if (this._handleValidationErrors(req, res)) return;

    try {
      const { id } = req.params;
      const { permisosIds } = req.body;
      
      await this.assignPermissionsUseCase.execute(id, permisosIds);
      res.json({ status: 'success', message: 'Permisos asignados exitosamente' });
    } catch (error) {
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({ status: 'error', message: error.message });
      }
       if (error.message.includes('superusuario principal')) {
        return res.status(403).json({ status: 'error', message: error.message });
      }
      next(error);
    }
  }
}
