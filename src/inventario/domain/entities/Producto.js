export class Producto {
  constructor({
    id_producto,
    codigo_barra,
    nombre,
    descripcion,
    categoria,
    unidad_medida,
    id_moneda_precio,
    peso_unitario,
    activo
  }) {
    this.id_producto = id_producto;
    this.codigo_barra = codigo_barra;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.categoria = categoria;
    this.unidad_medida = unidad_medida;
    this.id_moneda_precio = id_moneda_precio;
    this.peso_unitario = peso_unitario;
    this.activo = activo ?? true;
  }
}
