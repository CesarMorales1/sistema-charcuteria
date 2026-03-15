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
    variacion_diaria,
    moneda_origen,
    moneda_destino,
  }) {
    this.id_tipo_cambio      = id_tipo_cambio;
    this.moneda_origen_id    = moneda_origen_id;
    this.moneda_destino_id   = moneda_destino_id;
    this.tasa                = tasa;
    this.fecha_vigencia      = fecha_vigencia;
    this.fecha_fin           = fecha_fin      ?? null;
    this.hora_actualizacion  = hora_actualizacion ?? null;
    this.tipo                = tipo;           // 'oficial' | 'paralelo'
    this.fuente              = fuente          ?? 'BCV';
    this.variacion_diaria    = variacion_diaria ?? null;
    this.moneda_origen       = moneda_origen   ?? null;
    this.moneda_destino      = moneda_destino  ?? null;
  }
}
