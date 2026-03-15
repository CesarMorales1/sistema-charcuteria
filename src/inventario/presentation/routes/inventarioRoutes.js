import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware, requirePermission } from '../../../shared/middleware/auth.js';

// Permisos (IDs del seeder)
const PERM_VER_INVENTARIO      = 2;  // VER_INVENTARIO
const PERM_GESTION_INVENTARIO  = 3;  // GESTION_INVENTARIO

export const createInventarioRoutes = (inventarioController) => {
  const router = Router();
  router.use(authMiddleware);

  const valProducto = [
    body('nombre').notEmpty().withMessage('El nombre es requerido').isLength({ max: 100 }),
    body('codigo_barra').optional().isString(),
    body('descripcion').optional().isString(),
    body('categoria').optional().isString().isLength({ max: 50 }),
    body('unidad_medida').optional().isString().isLength({ max: 20 }),
    body('peso_unitario').optional().isDecimal(),
    body('id_moneda_precio').optional().isInt(),
  ];

  const valAjuste = [
    body('tipo_inventario').isIn(['general', 'legal', 'ambos']).withMessage('tipo_inventario debe ser general, legal o ambos'),
    body('cantidad').isFloat({ gt: 0 }).withMessage('cantidad debe ser mayor que 0'),
    body('tipo_movimiento').isIn(['entrada', 'salida', 'ajuste']).withMessage('tipo_movimiento inválido'),
    body('observacion').optional().isString(),
  ];

  // ── Productos (requiere gestión de inventario) ─────────────
  router.get('/productos',       requirePermission(PERM_VER_INVENTARIO),     inventarioController.listarProductos);
  router.get('/productos/:id',   requirePermission(PERM_VER_INVENTARIO),     inventarioController.obtenerProducto);
  router.post('/productos',      requirePermission(PERM_GESTION_INVENTARIO), valProducto, inventarioController.crearProducto);
  router.put('/productos/:id',   requirePermission(PERM_GESTION_INVENTARIO), valProducto, inventarioController.actualizarProducto);
  router.delete('/productos/:id',requirePermission(PERM_GESTION_INVENTARIO), inventarioController.eliminarProducto);

  // ── Inventario y Movimientos ───────────────────────────────
  router.get('/productos/:id/inventario',   requirePermission(PERM_VER_INVENTARIO),     inventarioController.verInventario);
  router.post('/productos/:id/ajuste',      requirePermission(PERM_GESTION_INVENTARIO), valAjuste, inventarioController.ajustar);
  router.get('/productos/:id/movimientos',  requirePermission(PERM_VER_INVENTARIO),     inventarioController.listarMovimientos);

  return router;
};
