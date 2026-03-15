export class Proveedor {
  constructor({
    id_proveedor,
    nombre,
    ruc,
    telefono,
    email,
    direccion,
    terminos_pago,
    activo
  }) {
    this.id_proveedor = id_proveedor;
    this.nombre = nombre;
    this.ruc = ruc;
    this.telefono = telefono;
    this.email = email;
    this.direccion = direccion;
    this.terminos_pago = terminos_pago;
    this.activo = activo ?? true;
  }
}
