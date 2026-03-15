export class CrearNotaCreditoDTO {
  constructor(data) {
    this.id_compra = data.id_compra;
    this.id_detalle_compra = data.id_detalle_compra;
    this.id_producto = data.id_producto;
    this.cantidad = data.cantidad;
    this.valor_unitario = data.valor_unitario;
    this.id_moneda = data.id_moneda;
    this.fecha = data.fecha;
    this.observacion = data.observacion;
  }
}
