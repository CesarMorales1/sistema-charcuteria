export class Venta {
  constructor({
    id_venta, fecha_venta, subtotal, alicuota_iva,
    monto_iva, total, id_moneda, tasa_referencia,
    reportable_seniat, estado, observacion, id_usuario,
    moneda, usuario, detalles
  }) {
    this.id_venta          = id_venta;
    this.fecha_venta       = fecha_venta;
    this.subtotal          = subtotal;
    this.alicuota_iva      = alicuota_iva  ?? 16.00;
    this.monto_iva         = monto_iva     ?? null;
    this.total             = total;
    this.id_moneda         = id_moneda     ?? null;
    this.tasa_referencia   = tasa_referencia ?? null;
    this.reportable_seniat = reportable_seniat ?? false;
    this.estado            = estado        ?? 'abierta';
    this.observacion       = observacion   ?? null;
    this.id_usuario        = id_usuario;
    this.moneda            = moneda        ?? null;
    this.usuario           = usuario       ?? null;
    this.detalles          = detalles      ?? [];
  }
}
