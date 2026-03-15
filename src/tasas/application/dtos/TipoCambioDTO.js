export class CrearTipoCambioDTO {
  constructor(data) {
    this.moneda_origen_id = data.moneda_origen_id;
    this.moneda_destino_id = data.moneda_destino_id;
    this.tasa = data.tasa;
    this.fecha_vigencia = data.fecha_vigencia;
    this.tipo = data.tipo;
    this.fuente = data.fuente;
    this.variacion_diaria = data.variacion_diaria;
  }
}

export class ActualizarTipoCambioDTO {
  constructor(data) {
    this.tasa = data.tasa;
    this.fecha_fin = data.fecha_fin;
    this.variacion_diaria = data.variacion_diaria;
  }
}
