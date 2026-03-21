import { validationResult } from 'express-validator';

export class InventarioController {
  constructor(useCases) {
    Object.assign(this, useCases);
  }

  _validar(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ status: 'error', errors: errors.array() }); return true; }
    return false;
  }
  _notFound(res, msg = 'No encontrado') { return res.status(404).json({ status: 'error', message: msg }); }
  _onNotFound(error, res, next) {
    const msg = error.message.toLowerCase();
    if (msg.includes('no encontrado') || msg.includes('not found')) return this._notFound(res, error.message);
    if (msg.includes('insuficiente')) return res.status(422).json({ status: 'error', message: error.message });
    if (msg.includes('requerido y debe ser un número entero válido')) return res.status(400).json({ status: 'error', message: error.message });
    next(error);
  }

  // ── Categorías ──────────────────────────────────────────────
  listarCategorias = async (req, res, next) => {
    try {
      const { soloActivos = 'true' } = req.query;
      const data = await this.listCategorias.execute({ soloActivos: soloActivos !== 'false' });
      res.json({ status: 'success', data });
    } catch (e) { next(e); }
  };

  obtenerCategoria = async (req, res, next) => {
    try {
      const c = await this.getCategoria.execute(req.params.id);
      res.json({ status: 'success', data: c });
    } catch (e) { this._onNotFound(e, res, next); }
  };

  crearCategoria = async (req, res, next) => {
    if (this._validar(req, res)) return;
    try {
      const c = await this.createCategoria.execute(req.body);
      res.status(201).json({ status: 'success', data: c });
    } catch (e) { next(e); }
  };

  actualizarCategoria = async (req, res, next) => {
    if (this._validar(req, res)) return;
    try {
      const c = await this.updateCategoria.execute(req.params.id, req.body);
      res.json({ status: 'success', data: c });
    } catch (e) { this._onNotFound(e, res, next); }
  };

  eliminarCategoria = async (req, res, next) => {
    try {
      await this.deleteCategoria.execute(req.params.id);
      res.json({ status: 'success', message: 'Categoría desactivada' });
    } catch (e) { this._onNotFound(e, res, next); }
  };

  // ── Unidades de Medida ───────────────────────────────────────
  listarUnidades = async (req, res, next) => {
    try {
      const { soloActivos = 'true' } = req.query;
      const data = await this.listUnidades.execute({ soloActivos: soloActivos !== 'false' });
      res.json({ status: 'success', data });
    } catch (e) { next(e); }
  };

  obtenerUnidad = async (req, res, next) => {
    try {
      const u = await this.getUnidad.execute(req.params.id);
      res.json({ status: 'success', data: u });
    } catch (e) { this._onNotFound(e, res, next); }
  };

  crearUnidad = async (req, res, next) => {
    if (this._validar(req, res)) return;
    try {
      const u = await this.createUnidad.execute(req.body);
      res.status(201).json({ status: 'success', data: u });
    } catch (e) { next(e); }
  };

  actualizarUnidad = async (req, res, next) => {
    if (this._validar(req, res)) return;
    try {
      const u = await this.updateUnidad.execute(req.params.id, req.body);
      res.json({ status: 'success', data: u });
    } catch (e) { this._onNotFound(e, res, next); }
  };

  eliminarUnidad = async (req, res, next) => {
    try {
      await this.deleteUnidad.execute(req.params.id);
      res.json({ status: 'success', message: 'Unidad de medida desactivada' });
    } catch (e) { this._onNotFound(e, res, next); }
  };

  // ── Productos ──────────────────────────────────────────────
  listarProductos = async (req, res, next) => {
    try {
      const { page = 1, limit = 20, search = '', id_categoria = null, soloActivos } = req.query;
      const r = await this.listProductos.execute({ page: +page, limit: +limit, search, id_categoria, soloActivos });
      res.json({ status: 'success', ...r });
    } catch (e) { next(e); }
  };

  obtenerProducto = async (req, res, next) => {
    try {
      const p = await this.getProducto.execute(req.params.id);
      res.json({ status: 'success', data: p });
    } catch (e) { this._onNotFound(e, res, next); }
  };

  crearProducto = async (req, res, next) => {
    if (this._validar(req, res)) return;
    try {
      const p = await this.createProducto.execute(req.body);
      res.status(201).json({ status: 'success', data: p });
    } catch (e) { this._onNotFound(e, res, next); }
  };

  actualizarProducto = async (req, res, next) => {
    if (this._validar(req, res)) return;
    try {
      const p = await this.updateProducto.execute(req.params.id, req.body);
      res.json({ status: 'success', data: p });
    } catch (e) { this._onNotFound(e, res, next); }
  };

  eliminarProducto = async (req, res, next) => {
    try {
      await this.deleteProducto.execute(req.params.id);
      res.json({ status: 'success', message: 'Producto desactivado' });
    } catch (e) { this._onNotFound(e, res, next); }
  };

  // ── Inventario y Movimientos ──────────────────────────────
  verInventario = async (req, res, next) => {
    try {
      const data = await this.getInventario.execute(req.params.id);
      res.json({ status: 'success', data });
    } catch (e) { next(e); }
  };

  ajustar = async (req, res, next) => {
    if (this._validar(req, res)) return;
    try {
      const data = await this.ajustarInventario.execute({
        ...req.body,
        id_producto: req.params.id,
        id_usuario: req.user.id_usuario,
      });
      res.json({ status: 'success', data });
    } catch (e) { this._onNotFound(e, res, next); }
  };

  listarMovimientos = async (req, res, next) => {
    try {
      const { page = 1, limit = 30, tipo_inventario } = req.query;
      const r = await this.listMovimientos.execute({
        id_producto: req.params.id,
        tipo_inventario,
        page: +page, limit: +limit
      });
      res.json({ status: 'success', ...r });
    } catch (e) { next(e); }
  };
}

