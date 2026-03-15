export class InventarioGeneral {
  constructor({
    id_inventario_gen,
    id_producto,
    cantidad_actual,
    ubicacion,
    valor_unitario,
    id_moneda_valor,
    fecha_actualizacion
  }) {
    this.id_inventario_gen = id_inventario_gen;
    this.id_producto = id_producto;
    this.cantidad_actual = cantidad_actual ?? 0;
    this.ubicacion = ubicacion;
    this.valor_unitario = valor_unitario;
    this.id_moneda_valor = id_moneda_valor;
    this.fecha_actualizacion = fecha_actualizacion;
  }
}
