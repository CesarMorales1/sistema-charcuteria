import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware, requirePermission } from '../../../shared/middleware/auth.js';

// GESTION_PROVEEDORES = ID 7 (ver GET /api/permisos para confirmarlo)
const PERM_GESTION_PROVEEDORES = 7;

export const createProveedorRoutes = (proveedorController) => {
  const router = Router();

  // Todas las rutas de proveedores requieren autenticación + permiso ID 7
  // El admin tiene bypass automático. El usuario necesita que el admin le asigne el permiso 7.
  router.use(authMiddleware);
  router.use(requirePermission(PERM_GESTION_PROVEEDORES));

  const validacionCrear = [
    body('nombre').notEmpty().withMessage('El nombre del proveedor es requerido').isLength({ max: 150 }),
    body('ruc').optional().isString().isLength({ max: 20 }),
    body('telefono').optional().isString().isLength({ max: 20 }),
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('direccion').optional().isString(),
    body('terminos_pago').optional().isString().isLength({ max: 100 }),
  ];

  const validacionActualizar = [
    body('nombre').optional().notEmpty().isLength({ max: 150 }),
    body('ruc').optional().isString().isLength({ max: 20 }),
    body('telefono').optional().isString().isLength({ max: 20 }),
    body('email').optional().isEmail(),
    body('direccion').optional().isString(),
    body('terminos_pago').optional().isString().isLength({ max: 100 }),
    body('activo').optional().isBoolean(),
  ];

  router.get('/', proveedorController.listar);
  router.get('/:id', proveedorController.obtenerPorId);
  router.post('/', validacionCrear, proveedorController.crear);
  router.put('/:id', validacionActualizar, proveedorController.actualizar);
  router.delete('/:id', proveedorController.eliminar);

  return router;
};
