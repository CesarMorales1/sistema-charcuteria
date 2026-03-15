export class Factura {
  constructor({
    id_factura,
    id_proveedor,
    id_compra,
    numero_factura,
    fecha_emision,
    fecha_vencimiento,
    base_imponible,
    alicuota_iva,
    monto_iva,
    monto_total,
    id_moneda_monto,
    tasa_referencia,
    estado,
    eliminada
  }) {
    this.id_factura = id_factura;
    this.id_proveedor = id_proveedor;
    this.id_compra = id_compra;
    this.numero_factura = numero_factura;
    this.fecha_emision = fecha_emision;
    this.fecha_vencimiento = fecha_vencimiento;
    this.base_imponible = base_imponible;
    this.alicuota_iva = alicuota_iva ?? 16.00;
    this.monto_iva = monto_iva;
    this.monto_total = monto_total;
    this.id_moneda_monto = id_moneda_monto;
    this.tasa_referencia = tasa_referencia;
    this.estado = estado ?? 'pendiente';
    this.eliminada = eliminada ?? false;
  }
}
