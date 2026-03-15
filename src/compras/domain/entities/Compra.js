export class Compra {
  constructor({
    id_compra,
    id_proveedor,
    fecha_compra,
    numero_factura,
    subtotal,
    id_moneda_subtotal,
    tasa_referencia,
    base_imponible,
    alicuota_iva,
    monto_iva,
    total,
    reportable_seniat,
    estado
  }) {
    this.id_compra = id_compra;
    this.id_proveedor = id_proveedor;
    this.fecha_compra = fecha_compra;
    this.numero_factura = numero_factura;
    this.subtotal = subtotal;
    this.id_moneda_subtotal = id_moneda_subtotal;
    this.tasa_referencia = tasa_referencia;
    this.base_imponible = base_imponible;
    this.alicuota_iva = alicuota_iva ?? 16.00;
    this.monto_iva = monto_iva;
    this.total = total;
    this.reportable_seniat = reportable_seniat ?? false;
    this.estado = estado ?? 'pendiente';
  }
}
