import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware, requirePermission } from '../../../shared/middleware/auth.js';

const PERM_GESTION_TASAS = 6; // GESTION_TASAS del seeder

export const createTasasRoutes = (tasasController) => {
  const router = Router();
  router.use(authMiddleware);

  const valRegistrar = [
    body('moneda_origen_id').isInt().withMessage('moneda_origen_id requerido'),
    body('moneda_destino_id').isInt().withMessage('moneda_destino_id requerido'),
    body('tasa').isFloat({ gt: 0 }).withMessage('tasa debe ser mayor que 0'),
    body('fecha_vigencia').optional().isISO8601().withMessage('fecha_vigencia debe ser YYYY-MM-DD'),
    body('tipo').optional().isIn(['oficial', 'paralelo']).withMessage('tipo debe ser oficial o paralelo'),
    body('fuente').optional().isString().isLength({ max: 50 }),
  ];

  // Registrar o actualizar la tasa del día — requiere permiso GESTION_TASAS
  router.post('/', requirePermission(PERM_GESTION_TASAS), valRegistrar, tasasController.registrar);

  // Consultas — cualquier usuario autenticado puede ver las tasas
  router.get('/vigente/:moneda_origen_id', tasasController.vigente);
  router.get('/historial',                 tasasController.historial);
  router.get('/fecha/:moneda_origen_id',   tasasController.porFecha);

  return router;
};
