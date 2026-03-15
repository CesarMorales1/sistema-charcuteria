export class CrearUsuarioDTO {
  constructor(data) {
    this.nombre = data.nombre;
    this.email = data.email;
    this.password = data.password;
    this.rol = data.rol ?? 'cajero';
  }
}

export class ActualizarUsuarioDTO {
  constructor(data) {
    this.nombre = data.nombre;
    this.email = data.email;
    this.rol = data.rol;
    this.activo = data.activo;
  }
}

export class LoginDTO {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
  }
}
