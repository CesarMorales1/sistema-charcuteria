import { validationResult } from 'express-validator';

export class CuentasPorPagarController {
  constructor(useCases) {
    this._createFactura  = useCases.createFactura;
    this._listFacturas   = useCases.listFacturas;
    this._getFactura     = useCases.getFactura;
    this._deleteFactura  = useCases.deleteFactura;
    this._registrarPago  = useCases.registrarPago;
    this._listPagos      = useCases.listPagos;
    this._saldoPendiente = useCases.saldoPendiente;
  }

  _err(res, next, error) {
    if (error.message.includes('no encontrada') || error.message.includes('no encontrado')) return res.status(404).json({ status: 'error', message: error.message });
    if (error.message.includes('pagada') || error.message.includes('supera') || error.message.includes('pagos registrados')) return res.status(422).json({ status: 'error', message: error.message });
    next(error);
  }

  listarFacturas = async (req, res, next) => {
    try {
      const { page = 1, limit = 20, id_proveedor, estado, vencidas } = req.query;
      const r = await this._listFacturas.execute({ page: +page, limit: +limit, id_proveedor, estado, vencidas });
      res.json({ status: 'success', ...r });
    } catch (e) { next(e); }
  };

  obtenerFactura = async (req, res, next) => {
    try {
      const f = await this._getFactura.execute(req.params.id);
      res.json({ status: 'success', data: f });
    } catch (e) { this._err(res, next, e); }
  };

  crearFactura = async (req, res, next) => {
    const e = validationResult(req);
    if (!e.isEmpty()) return res.status(400).json({ status: 'error', errors: e.array() });
    try {
      const f = await this._createFactura.execute(req.body);
      res.status(201).json({ status: 'success', data: f });
    } catch (err) { this._err(res, next, err); }
  };

  eliminarFactura = async (req, res, next) => {
    try {
      await this._deleteFactura.execute(req.params.id);
      res.json({ status: 'success', message: 'Factura eliminada' });
    } catch (e) { this._err(res, next, e); }
  };

  saldoPendiente = async (req, res, next) => {
    try {
      const data = await this._saldoPendiente.execute(req.params.id);
      res.json({ status: 'success', data });
    } catch (e) { this._err(res, next, e); }
  };

  registrarPago = async (req, res, next) => {
    const e = validationResult(req);
    if (!e.isEmpty()) return res.status(400).json({ status: 'error', errors: e.array() });
    try {
      const p = await this._registrarPago.execute({ ...req.body, id_factura: req.params.id });
      res.status(201).json({ status: 'success', data: p });
    } catch (err) { this._err(res, next, err); }
  };

  listarPagos = async (req, res, next) => {
    try {
      const pagos = await this._listPagos.execute(req.params.id);
      res.json({ status: 'success', data: pagos });
    } catch (e) { next(e); }
  };
}
