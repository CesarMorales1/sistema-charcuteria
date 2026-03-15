export class InventarioLegal {
  constructor({
    id_inventario_legal,
    id_producto,
    cantidad_actual,
    valor_unitario,
    id_moneda_valor,
    fecha_actualizacion
  }) {
    this.id_inventario_legal = id_inventario_legal;
    this.id_producto = id_producto;
    this.cantidad_actual = cantidad_actual ?? 0;
    this.valor_unitario = valor_unitario;
    this.id_moneda_valor = id_moneda_valor;
    this.fecha_actualizacion = fecha_actualizacion;
  }
}
