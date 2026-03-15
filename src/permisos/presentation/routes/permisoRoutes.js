import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware, requireRole } from '../../../shared/middleware/auth.js';

export const createPermisoRoutes = (permisoController) => {
  const router = Router();

  // Solo el admin puede gestionar los permisos del sistema
  router.use(authMiddleware, requireRole('admin'));

  const validacionCrear = [
    body('nombre').notEmpty().withMessage('El nombre es requerido').isLength({ max: 50 }),
    body('descripcion').optional().isString(),
    body('modulo').optional().isString().isLength({ max: 30 }),
  ];

  const validacionActualizar = [
    body('nombre').optional().notEmpty().isLength({ max: 50 }),
    body('descripcion').optional().isString(),
    body('modulo').optional().isString().isLength({ max: 30 }),
  ];

  // ─── Rutas (todas requieren admin) ───────────────────────────
  // GET /api/permisos → lista todos los permisos (para que el admin los vea al asignar)
  router.get('/', permisoController.listar);
  // POST /api/permisos → crea un nuevo permiso
  router.post('/', validacionCrear, permisoController.crear);
  // PUT /api/permisos/:id → edita un permiso existente
  router.put('/:id', validacionActualizar, permisoController.actualizar);
  // DELETE /api/permisos/:id → elimina un permiso
  router.delete('/:id', permisoController.eliminar);

  return router;
};
