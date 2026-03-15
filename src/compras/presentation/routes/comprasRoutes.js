import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware, requirePermission } from '../../../shared/middleware/auth.js';

// Permisos
const PERM_GESTION_COMPRAS = 4;  // GESTION_COMPRAS

export const createComprasRoutes = (comprasController) => {
  const router = Router();
  router.use(authMiddleware);
  router.use(requirePermission(PERM_GESTION_COMPRAS));

  const valDetalle = body('detalles').isArray({ min: 1 }).withMessage('Debe incluir al menos un detalle');
  const valDetalleItems = [
    body('detalles.*.id_producto').isInt().withMessage('id_producto debe ser entero'),
    body('detalles.*.cantidad').isFloat({ gt: 0 }).withMessage('cantidad debe ser > 0'),
    body('detalles.*.precio_unitario').isFloat({ gt: 0 }).withMessage('precio_unitario debe ser > 0'),
  ];

  const valCrear = [
    body('id_proveedor').isInt().withMessage('id_proveedor es requerido'),
    body('total').isFloat({ gt: 0 }).withMessage('total debe ser > 0'),
    body('reportable_seniat').isBoolean(),
    body('numero_factura').optional().isString(),
    body('id_moneda_subtotal').optional().isInt(),
    body('tasa_referencia').optional().isFloat(),
    body('alicuota_iva').optional().isFloat(),
    valDetalle, ...valDetalleItems,
  ];

  const valEstado = [
    body('estado').isIn(['pendiente', 'recibida', 'cancelada']).withMessage('Estado inválido')
  ];

  router.get('/',             comprasController.listar);
  router.get('/:id',          comprasController.obtener);
  router.post('/',            valCrear,   comprasController.crear);
  router.patch('/:id/estado', valEstado,  comprasController.cambiarEstado);
  router.patch('/:id/cancelar',           comprasController.cancelar);

  return router;
};
