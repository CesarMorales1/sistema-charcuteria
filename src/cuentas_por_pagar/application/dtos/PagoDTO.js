export class RegistrarPagoDTO {
  constructor(data) {
    this.id_factura = data.id_factura;
    this.monto = data.monto;
    this.id_moneda = data.id_moneda;
    this.tasa_pago = data.tasa_pago;
    this.metodo_pago = data.metodo_pago;
    this.referencia = data.referencia;
  }
}
