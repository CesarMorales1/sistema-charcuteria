export class CrearFacturaDTO {
  constructor(data) {
    this.id_proveedor = data.id_proveedor;
    this.id_compra = data.id_compra;
    this.numero_factura = data.numero_factura;
    this.fecha_emision = data.fecha_emision;
    this.fecha_vencimiento = data.fecha_vencimiento;
    this.base_imponible = data.base_imponible;
    this.alicuota_iva = data.alicuota_iva ?? 16.00;
    this.monto_iva = data.monto_iva;
    this.monto_total = data.monto_total;
    this.id_moneda_monto = data.id_moneda_monto;
    this.tasa_referencia = data.tasa_referencia;
  }
}

export class ActualizarFacturaDTO {
  constructor(data) {
    this.estado = data.estado;
    this.fecha_vencimiento = data.fecha_vencimiento;
  }
}
