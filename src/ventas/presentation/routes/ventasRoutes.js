import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware, requirePermission } from '../../../shared/middleware/auth.js';

// Permiso 8 = GESTION_VENTAS (agregar en el seeder si hace falta)
const PERM_GESTION_VENTAS = 8;

export const createVentasRoutes = (ventasController) => {
  const router = Router();
  router.use(authMiddleware);

  const valDetalle = body('detalles').isArray({ min: 1 }).withMessage('Debe incluir al menos un detalle');
  const valDetalleItems = [
    body('detalles.*.id_producto').isInt({ gt: 0 }).withMessage('id_producto debe ser entero positivo'),
    body('detalles.*.cantidad').isFloat({ gt: 0 }).withMessage('cantidad debe ser > 0'),
    body('detalles.*.precio_unitario').isFloat({ gt: 0 }).withMessage('precio_unitario debe ser > 0'),
  ];
  const valCrear = [
    body('reportable_seniat').isBoolean().withMessage('reportable_seniat debe ser booleano'),
    body('alicuota_iva').optional().isFloat({ min: 0 }),
    body('id_moneda').optional().isInt(),
    body('tasa_referencia').optional().isFloat(),
    body('observacion').optional().isString(),
    valDetalle,
    ...valDetalleItems,
  ];

  // Listar ventas: cualquier usuario autenticado puede ver
  router.get('/',       authMiddleware, ventasController.listar);
  router.get('/:id',    authMiddleware, ventasController.obtener);

  // Crear / anular ventas: requiere permiso GESTION_VENTAS
  router.post('/',               requirePermission(PERM_GESTION_VENTAS), valCrear, ventasController.crear);
  router.patch('/:id/anular',    requirePermission(PERM_GESTION_VENTAS), ventasController.anular);

  return router;
};
