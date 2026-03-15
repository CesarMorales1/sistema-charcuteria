export class Pago {
  constructor({
    id_pago,
    id_factura,
    fecha_pago,
    monto,
    id_moneda,
    tasa_pago,
    metodo_pago,
    referencia
  }) {
    this.id_pago = id_pago;
    this.id_factura = id_factura;
    this.fecha_pago = fecha_pago;
    this.monto = monto;
    this.id_moneda = id_moneda;
    this.tasa_pago = tasa_pago;
    this.metodo_pago = metodo_pago;
    this.referencia = referencia;
  }
}
