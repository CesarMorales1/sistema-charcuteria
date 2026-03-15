export class CrearCompraDTO {
  constructor(data) {
    this.id_proveedor = data.id_proveedor;
    this.numero_factura = data.numero_factura;
    this.id_moneda_subtotal = data.id_moneda_subtotal;
    this.tasa_referencia = data.tasa_referencia;
    this.alicuota_iva = data.alicuota_iva ?? 16.00;
    this.reportable_seniat = data.reportable_seniat ?? false;
    this.detalles = data.detalles;
  }
}

export class ActualizarCompraDTO {
  constructor(data) {
    this.estado = data.estado;
  }
}
