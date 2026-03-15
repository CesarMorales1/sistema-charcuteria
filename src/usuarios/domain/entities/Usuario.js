export class Usuario {
  constructor({
    id_usuario,
    nombre,
    email,
    password,
    rol,
    activo,
    fecha_creacion
  }) {
    this.id_usuario = id_usuario;
    this.nombre = nombre;
    this.email = email;
    this.password = password;
    this.rol = rol ?? 'cajero';
    this.activo = activo ?? true;
    this.fecha_creacion = fecha_creacion;
  }
}
