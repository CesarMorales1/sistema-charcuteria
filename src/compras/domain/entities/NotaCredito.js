export class NotaCredito {
  constructor({
    id_nota_credito,
    id_compra,
    id_detalle_compra,
    id_producto,
    cantidad,
    valor_unitario,
    id_moneda,
    fecha,
    observacion
  }) {
    this.id_nota_credito = id_nota_credito;
    this.id_compra = id_compra;
    this.id_detalle_compra = id_detalle_compra;
    this.id_producto = id_producto;
    this.cantidad = cantidad;
    this.valor_unitario = valor_unitario;
    this.id_moneda = id_moneda;
    this.fecha = fecha;
    this.observacion = observacion;
  }
}
