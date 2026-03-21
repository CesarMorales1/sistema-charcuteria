export class UnidadMedida {
  constructor({ id_unidad_medida, nombre, abreviatura, activo }) {
    this.id_unidad_medida = id_unidad_medida;
    this.nombre = nombre;
    this.abreviatura = abreviatura;
    this.activo = activo ?? true;
  }
}
