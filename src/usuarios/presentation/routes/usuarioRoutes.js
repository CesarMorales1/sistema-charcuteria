import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware, requirePermission, requireRole } from '../../../shared/middleware/auth.js';

export const createUsuarioRoutes = (usuarioController) => {
  const router = Router();

  // Validaciones
  const validacionCrear = [
    body('nombre').notEmpty().withMessage('El nombre es requerido').isLength({ max: 100 }),
    body('email').isEmail().withMessage('Correo electrónico inválido').isLength({ max: 100 }),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres').isLength({ max: 255 }),
    body('rol').optional().isIn(['cajero', 'bodega']).withMessage('Rol inválido. Solo puedes registrarte como cajero o bodega.'),
  ];

  const validacionActualizar = [
    body('nombre').optional().notEmpty().isLength({ max: 100 }),
    body('email').optional().isEmail().isLength({ max: 100 }),
    body('password').optional().isLength({ min: 6 }),
    body('rol').optional().isIn(['admin', 'cajero', 'bodega']),
    body('activo').optional().isBoolean()
  ];

  const validacionPermisos = [
    body('permisosIds').isArray().withMessage('permisosIds debe ser un arreglo de números')
  ];

  // ─── RUTAS PÚBLICAS ─────────────────────────────────────────
  // Crear usuario (registro) — no necesita token
  router.post('/', validacionCrear, usuarioController.crearUsuario);

  // ─── RUTAS PROTEGIDAS (requieren JWT) ────────────────────────
  // Listar y ver usuarios: requiere permiso GESTION_USUARIOS (admin bypass automático)
  router.get('/', authMiddleware, requirePermission('GESTION_USUARIOS'), usuarioController.obtenerUsuarios);
  router.get('/:id', authMiddleware, requirePermission('GESTION_USUARIOS'), usuarioController.obtenerUsuarioPorId);

  // Actualizar usuario: requiere permiso GESTION_USUARIOS
  router.put('/:id', authMiddleware, requirePermission('GESTION_USUARIOS'), validacionActualizar, usuarioController.actualizarUsuario);

  // ─── RUTAS SOLO ADMIN ────────────────────────────────────────
  // Borrar usuarios y gestionar permisos: exclusivo del administrador
  router.delete('/:id', authMiddleware, requireRole('admin'), usuarioController.eliminarUsuario);
  router.post('/:id/permisos', authMiddleware, requireRole('admin'), validacionPermisos, usuarioController.asignarPermisos);

  return router;
};

