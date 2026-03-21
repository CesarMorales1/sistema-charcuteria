export class CategoriaProducto {
  constructor({ id_categoria, nombre, descripcion, activo }) {
    this.id_categoria = id_categoria;
    this.nombre = nombre;
    this.descripcion = descripcion ?? null;
    this.activo = activo ?? true;
  }
}
