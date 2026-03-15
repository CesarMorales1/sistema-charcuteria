import { validationResult } from 'express-validator';

export class AuthController {
  constructor(loginUseCase) {
    this.loginUseCase = loginUseCase;
  }

  login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }

    try {
      const result = await this.loginUseCase.execute(req.body);
      res.json({ status: 'success', data: result });
    } catch (error) {
      if (error.message.includes('Credenciales inválidas')) {
        return res.status(401).json({ status: 'error', message: error.message });
      }
      next(error);
    }
  };

  obtenerUsuarioActual = async (req, res, next) => {
    try {
      // req.user viene del authMiddleware
      if (!req.user) {
         return res.status(401).json({ status: 'error', message: 'No autenticado' });
      }
      res.json({ status: 'success', data: req.user });
    } catch (error) {
      next(error);
    }
  };
}
