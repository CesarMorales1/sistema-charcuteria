import { validationResult } from 'express-validator';

export class ComprasController {
  constructor(useCases) {
    // Use prefixed names to avoid collisions with method names
    this._createCompra   = useCases.createCompra;
    this._listCompras    = useCases.listCompras;
    this._getCompra      = useCases.getCompra;
    this._cambiarEstado  = useCases.cambiarEstado;
    this._cancelarCompra = useCases.cancelarCompra;
  }

  _err(res, next, error) {
    if (error.message.includes('no encontrada') || error.message.includes('no encontrado')) return res.status(404).json({ status: 'error', message: error.message });
    if (error.message.includes('cancelada') || error.message.includes('insuficiente')) return res.status(422).json({ status: 'error', message: error.message });
    next(error);
  }

  listar = async (req, res, next) => {
    try {
      const { page = 1, limit = 20, id_proveedor, reportable_seniat, estado, numero_factura, fecha_desde, fecha_hasta } = req.query;
      const r = await this._listCompras.execute({ page: +page, limit: +limit, id_proveedor, reportable_seniat, estado, numero_factura, fecha_desde, fecha_hasta });
      res.json({ status: 'success', ...r });
    } catch (e) { next(e); }
  };

  obtener = async (req, res, next) => {
    try {
      const c = await this._getCompra.execute(req.params.id);
      res.json({ status: 'success', data: c });
    } catch (e) { this._err(res, next, e); }
  };

  crear = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: 'error', errors: errors.array() });
    try {
      const c = await this._createCompra.execute(req.body, req.user.id_usuario);
      res.status(201).json({ status: 'success', data: c });
    } catch (e) { this._err(res, next, e); }
  };

  cambiarEstado = async (req, res, next) => {
    try {
      const c = await this._cambiarEstado.execute(req.params.id, req.body.estado);
      res.json({ status: 'success', data: c });
    } catch (e) { this._err(res, next, e); }
  };

  cancelar = async (req, res, next) => {
    try {
      const c = await this._cancelarCompra.execute(req.params.id);
      res.json({ status: 'success', data: c });
    } catch (e) { this._err(res, next, e); }
  };
}
