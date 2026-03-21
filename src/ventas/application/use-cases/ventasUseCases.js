/**
 * CreateVentaUseCase
 * - Calcula subtotal, IVA y total a partir de los detalles.
 * - Llama a repository.save() que descuenta el inventario atómicamente.
 */
export class CreateVentaUseCase {
  constructor(ventaRepository) { this.r = ventaRepository; }

  async execute(data, id_usuario) {
    // Calcular subtotales por línea
    const detalles = data.detalles.map(d => ({
      ...d,
      subtotal_linea: parseFloat(d.cantidad) * parseFloat(d.precio_unitario),
    }));

    const subtotal       = detalles.reduce((acc, d) => acc + d.subtotal_linea, 0);
    const alicuota       = parseFloat(data.alicuota_iva ?? 16);
    const monto_iva      = data.reportable_seniat ? (subtotal * alicuota / 100) : null;
    const total          = subtotal + (monto_iva ?? 0);

    return this.r.save({
      ...data,
      detalles,
      subtotal,
      monto_iva,
      total,
      id_usuario,
    });
  }
}

export class ListVentasUseCase {
  constructor(ventaRepository) { this.r = ventaRepository; }
  async execute(opts) { return this.r.findAll(opts); }
}

export class GetVentaUseCase {
  constructor(ventaRepository) { this.r = ventaRepository; }
  async execute(id) {
    const v = await this.r.findById(id);
    if (!v) throw new Error('Venta no encontrada');
    return v;
  }
}

export class AnularVentaUseCase {
  constructor(ventaRepository) { this.r = ventaRepository; }
  async execute(id, id_usuario) {
    const v = await this.r.findById(id);
    if (!v) throw new Error('Venta no encontrada');
    if (v.estado === 'anulada') throw new Error('La venta ya está anulada');
    return this.r.anular(id, id_usuario);
  }
}
