export class MovimientoInventario {
  constructor({
    id_movimiento,
    id_producto,
    tipo_movimiento,
    tipo_inventario,
    cantidad,
    cantidad_anterior,
    cantidad_nueva,
    id_origen_tipo,
    id_origen,
    id_usuario,
    fecha,
    observacion
  }) {
    this.id_movimiento = id_movimiento;
    this.id_producto = id_producto;
    this.tipo_movimiento = tipo_movimiento;
    this.tipo_inventario = tipo_inventario;
    this.cantidad = cantidad;
    this.cantidad_anterior = cantidad_anterior;
    this.cantidad_nueva = cantidad_nueva;
    this.id_origen_tipo = id_origen_tipo;
    this.id_origen = id_origen;
    this.id_usuario = id_usuario;
    this.fecha = fecha;
    this.observacion = observacion;
  }
}
