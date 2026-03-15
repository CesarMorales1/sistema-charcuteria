export class CrearProveedorDTO {
  constructor(data) {
    this.nombre = data.nombre;
    this.ruc = data.ruc;
    this.telefono = data.telefono;
    this.email = data.email;
    this.direccion = data.direccion;
    this.terminos_pago = data.terminos_pago;
  }
}

export class ActualizarProveedorDTO {
  constructor(data) {
    this.nombre = data.nombre;
    this.ruc = data.ruc;
    this.telefono = data.telefono;
    this.email = data.email;
    this.direccion = data.direccion;
    this.terminos_pago = data.terminos_pago;
    this.activo = data.activo;
  }
}
