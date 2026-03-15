export class CreateCompraUseCase {
  constructor(compraRepository) { this.r = compraRepository; }
  async execute(data, id_usuario) {
    // Calcular subtotales y totales si no vienen calculados
    const detalles = data.detalles.map(d => ({
      ...d,
      subtotal_linea: parseFloat(d.cantidad) * parseFloat(d.precio_unitario)
    }));
    const subtotal = detalles.reduce((acc, d) => acc + d.subtotal_linea, 0);
    const alicuota = parseFloat(data.alicuota_iva ?? 16);
    const base_imponible = data.reportable_seniat ? subtotal : null;
    const monto_iva = data.reportable_seniat ? (subtotal * alicuota / 100) : null;
    const total = subtotal + (monto_iva ?? 0);

    return this.r.save({
      ...data,
      detalles,
      subtotal,
      base_imponible,
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
