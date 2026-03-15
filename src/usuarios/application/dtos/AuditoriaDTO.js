export class RegistrarAuditoriaDTO {
  constructor(data) {
    this.tabla = data.tabla;
    this.accion = data.accion;
    this.id_registro = data.id_registro;
    this.usuario_id = data.usuario_id;
    this.ip_address = data.ip_address;
    this.user_agent = data.user_agent;
    this.datos_anteriores = data.datos_anteriores;
    this.datos_nuevos = data.datos_nuevos;
    this.observacion = data.observacion;
  }
}
