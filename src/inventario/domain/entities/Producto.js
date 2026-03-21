export class Producto {
  constructor({
    id_producto, codigo_barra, nombre, descripcion,
    id_categoria, categoria, 
    id_unidad_medida, unidad_medida, 
    id_moneda_precio,
    precio_base,
    peso_unitario, activo,
    inventario_general, inventario_legal
  }) {
    this.id_producto = id_producto;
    this.codigo_barra = codigo_barra ?? null;
    this.nombre = nombre;
    this.descripcion = descripcion ?? null;
    this.id_categoria = id_categoria;
    this.categoria = categoria ?? null;
    this.id_unidad_medida = id_unidad_medida;
    this.unidad_medida = unidad_medida ?? null;
    this.id_moneda_precio = id_moneda_precio ?? null;
    this.precio_base = precio_base ? Number(precio_base) : 0;
    this.peso_unitario = peso_unitario ?? null;
    this.activo = activo ?? true;
    // Snapshot del inventario (opcional, cargado cuando se incluye)
    this.inventario_general = inventario_general ?? null;
    this.inventario_legal = inventario_legal ?? null;
  }
}
