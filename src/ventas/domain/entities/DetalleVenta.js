export class DetalleVenta {
  constructor({ id_detalle, id_venta, id_producto, cantidad, precio_unitario, subtotal_linea, producto }) {
    this.id_detalle      = id_detalle;
    this.id_venta        = id_venta;
    this.id_producto     = id_producto;
    this.cantidad        = cantidad;
    this.precio_unitario = precio_unitario;
    this.subtotal_linea  = subtotal_linea;
    this.producto        = producto ?? null;
  }
}
