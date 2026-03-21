export class CreateCompraUseCase {
  constructor(compraRepository) { this.r = compraRepository; }
  async execute(data, id_usuario) {
    // Calculate line subtotals
    const detalles = data.detalles.map(d => ({
      ...d,
      subtotal_linea: parseFloat(d.cantidad) * parseFloat(d.precio_unitario)
    }));
    const subtotal = detalles.reduce((acc, d) => acc + d.subtotal_linea, 0);

    // Trust the frontend-calculated IVA values (computed per-line with aplicar_iva flag).
    // Only fall back to recalculation when values are not provided.
    const monto_iva      = data.monto_iva      != null ? parseFloat(data.monto_iva)      : 0;
    const alicuota_iva   = data.alicuota_iva   != null ? parseFloat(data.alicuota_iva)   : 0;
    const base_imponible = data.base_imponible  != null ? parseFloat(data.base_imponible) : subtotal;
    const total          = subtotal + monto_iva;

    return this.r.save({
      ...data,
      detalles,
      subtotal,
      base_imponible,
      alicuota_iva,
      monto_iva,
      total,
      id_usuario,
    });
  }
}

export class ListComprasUseCase {
  constructor(compraRepository) { this.r = compraRepository; }
  async execute(opts) { return this.r.findAll(opts); }
}

export class GetCompraUseCase {
  constructor(compraRepository) { this.r = compraRepository; }
  async execute(id) {
    const c = await this.r.findById(id);
    if (!c) throw new Error('Compra no encontrada');
    return c;
  }
}

export class CambiarEstadoCompraUseCase {
  constructor(compraRepository) { this.r = compraRepository; }
  async execute(id, estado) {
    const c = await this.r.findById(id);
    if (!c) throw new Error('Compra no encontrada');
    if (c.estado === 'cancelada') throw new Error('No se puede modificar una compra cancelada');
    return this.r.updateEstado(id, estado);
  }
}

export class CancelarCompraUseCase {
  constructor(compraRepository) { this.r = compraRepository; }
  async execute(id) {
    const c = await this.r.findById(id);
    if (!c) throw new Error('Compra no encontrada');
    if (c.estado === 'cancelada') throw new Error('La compra ya está cancelada');
    return this.r.cancelar(id);
  }
}
