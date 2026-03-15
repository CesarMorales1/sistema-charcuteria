export class Compra {
  constructor({
    id_compra, id_proveedor, fecha_compra, numero_factura,
    subtotal, id_moneda_subtotal, tasa_referencia,
    base_imponible, alicuota_iva, monto_iva, total,
    reportable_seniat, estado,
    proveedor, detalles
  }) {
    this.id_compra = id_compra;
    this.id_proveedor = id_proveedor;
    this.fecha_compra = fecha_compra;
    this.numero_factura = numero_factura ?? null;
    this.subtotal = subtotal ?? null;
    this.id_moneda_subtotal = id_moneda_subtotal ?? null;
    this.tasa_referencia = tasa_referencia ?? null;
    this.base_imponible = base_imponible ?? null;
    this.alicuota_iva = alicuota_iva ?? 16.00;
    this.monto_iva = monto_iva ?? null;
    this.total = total;
    this.reportable_seniat = reportable_seniat ?? false;
    this.estado = estado ?? 'pendiente';
    this.proveedor = proveedor ?? null;
    this.detalles = detalles ?? [];
  }
}
