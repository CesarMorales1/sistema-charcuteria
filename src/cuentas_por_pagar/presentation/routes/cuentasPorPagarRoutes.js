import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware, requirePermission } from '../../../shared/middleware/auth.js';

const PERM_GESTION_FACTURAS = 5;  // GESTION_FACTURAS

export const createCuentasPorPagarRoutes = (ctrl) => {
  const router = Router();
  router.use(authMiddleware);
  router.use(requirePermission(PERM_GESTION_FACTURAS));

  const valFactura = [
    body('id_proveedor').isInt().withMessage('id_proveedor requerido'),
    body('numero_factura').notEmpty().withMessage('numero_factura requerido'),
    body('fecha_emision').isISO8601().withMessage('fecha_emision inválida'),
    body('fecha_vencimiento').isISO8601().withMessage('fecha_vencimiento inválida'),
    body('base_imponible').isFloat({ gt: 0 }).withMessage('base_imponible debe ser > 0'),
    body('id_moneda_monto').isInt().withMessage('id_moneda_monto requerido'),
    body('alicuota_iva').optional().isFloat({ min: 0, max: 100 }),
    body('id_compra').optional().isInt(),
    body('tasa_referencia').optional().isFloat(),
  ];

  const valPago = [
    body('monto').isFloat({ gt: 0 }).withMessage('monto debe ser > 0'),
    body('id_moneda').isInt().withMessage('id_moneda requerido'),
    body('metodo_pago').isIn(['efectivo', 'transferencia', 'cheque', 'zelle']).withMessage('metodo_pago inválido'),
    body('referencia').optional().isString(),
    body('tasa_pago').optional().isFloat(),
  ];

  // Facturas
  router.get('/',           ctrl.listarFacturas);
  router.get('/:id',        ctrl.obtenerFactura);
  router.post('/', valFactura, ctrl.crearFactura);
  router.delete('/:id',     ctrl.eliminarFactura);

  // Saldo
  router.get('/:id/saldo',  ctrl.saldoPendiente);

  // Pagos de una factura
  router.get('/:id/pagos',         ctrl.listarPagos);
  router.post('/:id/pagos', valPago, ctrl.registrarPago);

  return router;
};
