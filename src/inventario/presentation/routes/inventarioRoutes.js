import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../../../shared/middleware/auth.js';

export const createInventarioRoutes = (inventarioController) => {
  const router = Router();
  // router.use(authMiddleware); // Comentado temporalmente por solicitud del cliente

  // ── Validadores ───────────────────────────────────────────
  const valCategoria = [
    body('nombre').notEmpty().withMessage('El nombre es requerido').isLength({ max: 50 }),
    body('descripcion').optional().isString(),
  ];

  const valUnidad = [
    body('nombre').notEmpty().withMessage('El nombre es requerido').isLength({ max: 50 }),
    body('abreviatura').notEmpty().withMessage('La abreviatura es requerida').isLength({ max: 10 }),
  ];

  const valProducto = [
    body('nombre').notEmpty().withMessage('El nombre es requerido').isLength({ max: 100 }),
    body('id_categoria').notEmpty().isInt({ min: 1 }).withMessage('id_categoria es requerido y debe ser un entero'),
    body('id_unidad_medida').notEmpty().isInt({ min: 1 }).withMessage('id_unidad_medida es requerido y debe ser un entero'),
    body('codigo_barra').optional().isString(),
    body('descripcion').optional().isString(),
    body('peso_unitario').optional().isDecimal(),
    body('id_moneda_precio').optional().isInt(),
    body('precio_base').optional().isFloat({ min: 0 }),
  ];

  const valAjuste = [
    body('tipo_inventario').isIn(['general', 'legal', 'ambos']).withMessage('tipo_inventario debe ser general, legal o ambos'),
    body('cantidad').isFloat({ gt: 0 }).withMessage('cantidad debe ser mayor que 0'),
    body('tipo_movimiento').isIn(['entrada', 'salida', 'ajuste']).withMessage('tipo_movimiento inválido'),
    body('observacion').optional().isString(),
  ];

  // ── Categorías ────────────────────────────────────────────
  router.get('/categorias', inventarioController.listarCategorias);
  router.get('/categorias/:id', inventarioController.obtenerCategoria);
  router.post('/categorias', valCategoria, inventarioController.crearCategoria);
  router.put('/categorias/:id', valCategoria, inventarioController.actualizarCategoria);
  router.delete('/categorias/:id', inventarioController.eliminarCategoria);

  // ── Unidades de Medida ────────────────────────────────────
  router.get('/unidades-medida', inventarioController.listarUnidades);
  router.get('/unidades-medida/:id', inventarioController.obtenerUnidad);
  router.post('/unidades-medida', valUnidad, inventarioController.crearUnidad);
  router.put('/unidades-medida/:id', valUnidad, inventarioController.actualizarUnidad);
  router.delete('/unidades-medida/:id', inventarioController.eliminarUnidad);

  // ── Productos ─────────────────────────────────────────────
  router.get('/productos', inventarioController.listarProductos);
  router.get('/productos/:id', inventarioController.obtenerProducto);
  router.post('/productos', valProducto, inventarioController.crearProducto);
  router.put('/productos/:id', valProducto, inventarioController.actualizarProducto);
  router.delete('/productos/:id', inventarioController.eliminarProducto);

  // ── Inventario y Movimientos ──────────────────────────────
  router.get('/productos/:id/inventario', inventarioController.verInventario);
  router.post('/productos/:id/ajuste', valAjuste, inventarioController.ajustar);
  router.get('/productos/:id/movimientos', inventarioController.listarMovimientos);

  return router;
};

