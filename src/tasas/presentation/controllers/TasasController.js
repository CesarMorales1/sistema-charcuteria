import { validationResult } from 'express-validator';

export class TasasController {
  constructor(useCases) {
    this._registrarTasa     = useCases.registrarTasa;
    this._getTasaVigente    = useCases.getTasaVigente;
    this._getHistorial      = useCases.getHistorial;
    this._getTasaPorFecha   = useCases.getTasaPorFecha;
  }

  _err(res, next, error) {
    if (error.message.includes('Sin tasa') || error.message.includes('No hay tasa')) {
      return res.status(404).json({ status: 'error', message: error.message });
    }
    next(error);
  }

  /** POST /tasas — Registra la tasa del día (crea o actualiza). */
  registrar = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: 'error', errors: errors.array() });
    try {
      const tasa = await this._registrarTasa.execute(req.body);
      res.status(201).json({ status: 'success', data: tasa });
    } catch (e) { next(e); }
  };

  /** GET /tasas/vigente/:moneda_origen_id — Tasa vigente más reciente. */
  vigente = async (req, res, next) => {
    try {
      const tasa = await this._getTasaVigente.execute(req.params.moneda_origen_id);
      res.json({ status: 'success', data: tasa });
    } catch (e) { this._err(res, next, e); }
  };

  /** GET /tasas/historial — Historial con filtros opcionales. */
  historial = async (req, res, next) => {
    try {
      const { moneda_origen_id, desde, hasta, tipo, page = 1, limit = 30 } = req.query;
      const data = await this._getHistorial.execute({
        moneda_origen_id: moneda_origen_id ? parseInt(moneda_origen_id) : undefined,
        desde, hasta, tipo,
        page: +page, limit: +limit
      });
      res.json({ status: 'success', ...data });
    } catch (e) { next(e); }
  };

  /** GET /tasas/fecha/:moneda_origen_id?fecha=YYYY-MM-DD — Tasa para una fecha específica. */
  porFecha = async (req, res, next) => {
    try {
      const { fecha } = req.query;
      if (!fecha) return res.status(400).json({ status: 'error', message: 'El parámetro fecha es requerido (YYYY-MM-DD)' });
      const tasa = await this._getTasaPorFecha.execute(req.params.moneda_origen_id, fecha);
      res.json({ status: 'success', data: tasa });
    } catch (e) { this._err(res, next, e); }
  };
}
