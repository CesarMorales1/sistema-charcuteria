import { validationResult } from 'express-validator';

export class VentasController {
  constructor(useCases) {
    this._createVenta  = useCases.createVenta;
    this._listVentas   = useCases.listVentas;
    this._getVenta     = useCases.getVenta;
    this._anularVenta  = useCases.anularVenta;
  }

  _err(res, next, error) {
    const msg = error.message || '';
    if (msg.includes('no encontrada'))  return res.status(404).json({ status: 'error', message: msg });
    if (msg.includes('ya está anulada') || msg.includes('insuficiente'))
      return res.status(422).json({ status: 'error', message: msg });
    next(error);
  }

  listar = async (req, res, next) => {
    try {
      const { page = 1, limit = 20, estado, reportable_seniat, fecha_desde, fecha_hasta } = req.query;
      const r = await this._listVentas.execute({
        page: +page, limit: +limit, estado, reportable_seniat, fecha_desde, fecha_hasta,
      });
      res.json({ status: 'success', ...r });
    } catch (e) { next(e); }
  };

  obtener = async (req, res, next) => {
    try {
      const v = await this._getVenta.execute(req.params.id);
      res.json({ status: 'success', data: v });
    } catch (e) { this._err(res, next, e); }
  };

  crear = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: 'error', errors: errors.array() });
    try {
      const v = await this._createVenta.execute(req.body, req.user.id_usuario);
      res.status(201).json({ status: 'success', data: v });
    } catch (e) { this._err(res, next, e); }
  };

  anular = async (req, res, next) => {
    try {
      const v = await this._anularVenta.execute(req.params.id, req.user.id_usuario);
      res.json({ status: 'success', data: v });
    } catch (e) { this._err(res, next, e); }
  };
}
