export class RegistrarMovimientoDTO {
  constructor(data) {
    this.id_producto = data.id_producto;
    this.tipo_movimiento = data.tipo_movimiento;
    this.tipo_inventario = data.tipo_inventario;
    this.cantidad = data.cantidad;
    this.id_origen_tipo = data.id_origen_tipo;
    this.id_origen = data.id_origen;
    this.id_usuario = data.id_usuario;
    this.observacion = data.observacion;
  }
}
