import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedError('Token no proporcionado');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    next(error);
  }
};

export const requirePermission = (permisoId) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // El admin siempre tiene acceso total a todo el sistema
    if (req.user.rol === 'admin') {
      return next();
    }

    // Comparar por ID numérico (evita errores de tipeo con strings)
    const idRequerido = Number(permisoId);
    const tienePermiso = req.user.permisos && req.user.permisos.includes(idRequerido);

    if (!tienePermiso) {
      return res.status(403).json({
        error: 'No tienes permiso para realizar esta acción',
        permisoRequerido: idRequerido
      });
    }

    next();
  };
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const rolesArray = Array.isArray(roles) ? roles : [roles];

    if (!rolesArray.includes(req.user.rol)) {
      return res.status(403).json({
        error: 'No tienes el rol necesario para esta acción',
        rolRequerido: rolesArray
      });
    }

    next();
  };
};
