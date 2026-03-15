export class TipoCambio {
  constructor({
    id_tipo_cambio,
    moneda_origen_id,
    moneda_destino_id,
    tasa,
    fecha_vigencia,
    fecha_fin,
    hora_actualizacion,
    tipo,
    fuente,
    variacion_diaria
  }) {
    this.id_tipo_cambio = id_tipo_cambio;
    this.moneda_origen_id = moneda_origen_id;
    this.moneda_destino_id = moneda_destino_id;
    this.tasa = tasa;
    this.fecha_vigencia = fecha_vigencia;
    this.fecha_fin = fecha_fin;
    this.hora_actualizacion = hora_actualizacion;
    this.tipo = tipo;
    this.fuente = fuente;
    this.variacion_diaria = variacion_diaria;
  }
}
