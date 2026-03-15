export class DetalleCompra {
  constructor({
    id_detalle,
    id_compra,
    id_producto,
    cantidad,
    precio_unitario,
    subtotal_linea
  }) {
    this.id_detalle = id_detalle;
    this.id_compra = id_compra;
    this.id_producto = id_producto;
    this.cantidad = cantidad;
    this.precio_unitario = precio_unitario;
    this.subtotal_linea = subtotal_linea;
  }
}
