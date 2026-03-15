export class CrearProductoDTO {
  constructor(data) {
    this.codigo_barra = data.codigo_barra;
    this.nombre = data.nombre;
    this.descripcion = data.descripcion;
    this.categoria = data.categoria;
    this.unidad_medida = data.unidad_medida;
    this.id_moneda_precio = data.id_moneda_precio;
    this.peso_unitario = data.peso_unitario;
  }
}

export class ActualizarProductoDTO {
  constructor(data) {
    this.codigo_barra = data.codigo_barra;
    this.nombre = data.nombre;
    this.descripcion = data.descripcion;
    this.categoria = data.categoria;
    this.unidad_medida = data.unidad_medida;
    this.id_moneda_precio = data.id_moneda_precio;
    this.peso_unitario = data.peso_unitario;
    this.activo = data.activo;
  }
}
