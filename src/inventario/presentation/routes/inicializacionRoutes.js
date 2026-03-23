import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authMiddleware } from '../../../shared/middleware/auth.js';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

export function createInicializacionRoutes(controller) {
  const router = Router();

  // Route to check if the inventory has been initialized (Public)
  router.get('/estado', controller.getEstado.bind(controller));

  // Requerir autenticación para el resto (inicializar)
  router.post(
    '/',
    authMiddleware,
    [
      body('productos').isArray().withMessage('Se requiere una lista de productos'),
      body('productos.*.id_producto').isInt().withMessage('ID de producto inválido'),
      body('productos.*.cantidad').isFloat({ min: 0 }).withMessage('La cantidad debe ser 0 o mayor'),
      body('productos.*.valor_unitario').optional({ nullable: true }).isFloat({ min: 0 })
    ],
    validateRequest,
    controller.inicializar.bind(controller)
  );

  return router;
}
