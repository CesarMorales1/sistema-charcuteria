export class Auditoria {
  constructor({
    id_auditoria,
    tabla,
    accion,
    id_registro,
    usuario_id,
    fecha_cambio,
    ip_address,
    user_agent,
    datos_anteriores,
    datos_nuevos,
    observacion
  }) {
    this.id_auditoria = id_auditoria;
    this.tabla = tabla;
    this.accion = accion;
    this.id_registro = id_registro;
    this.usuario_id = usuario_id;
    this.fecha_cambio = fecha_cambio;
    this.ip_address = ip_address;
    this.user_agent = user_agent;
    this.datos_anteriores = datos_anteriores;
    this.datos_nuevos = datos_nuevos;
    this.observacion = observacion;
  }
}
