import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../../../shared/middleware/auth.js';

export const createAuthRoutes = (authController) => {
  const router = Router();

  const validacionLogin = [
    body('email').isEmail().withMessage('Correo electrónico inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida')
  ];

  router.post('/login', validacionLogin, authController.login);
  router.get('/me', authMiddleware, authController.obtenerUsuarioActual);

  return router;
};
