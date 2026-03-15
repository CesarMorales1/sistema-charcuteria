import { validationResult } from 'express-validator';
import { ValidationError } from './errors.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));

    throw new ValidationError('Errores de validación', formattedErrors);
  }

  next();
};

export const isValidMoneda = (codigo) => {
  const monedasValidas = ['VES', 'USD', 'COP'];
  return monedasValidas.includes(codigo);
};

export const isValidRol = (rol) => {
  const rolesValidos = ['admin', 'cajero', 'bodega'];
  return rolesValidos.includes(rol);
};

export const isValidEstadoCompra = (estado) => {
  const estadosValidos = ['pendiente', 'recibida', 'cancelada'];
  return estadosValidos.includes(estado);
};

export const isValidEstadoFactura = (estado) => {
  const estadosValidos = ['pendiente', 'parcial', 'pagada', 'vencida'];
  return estadosValidos.includes(estado);
};

export const isValidMetodoPago = (metodo) => {
  const metodosValidos = ['efectivo', 'transferencia', 'cheque', 'zelle'];
  return metodosValidos.includes(metodo);
};
