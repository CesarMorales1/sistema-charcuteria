/**
 * Registra o actualiza la tasa del dólar para un día.
 * Si ya existe una tasa para esa fecha, la sobreescribe (útil para correcciones del día).
 */
export class RegistrarTasaUseCase {
  constructor(tipoCambioRepository) { this.r = tipoCambioRepository; }

  async execute({ moneda_origen_id, moneda_destino_id, tasa, fecha_vigencia, tipo, fuente }) {
    if (!fecha_vigencia) {
      // Por defecto usa la fecha de hoy
      fecha_vigencia = new Date().toISOString().split('T')[0];
    }
    return this.r.upsert({
      moneda_origen_id:  parseInt(moneda_origen_id),
      moneda_destino_id: parseInt(moneda_destino_id),
      tasa:              parseFloat(tasa),
      fecha_vigencia,
      tipo:              tipo   ?? 'oficial',
      fuente:            fuente ?? 'BCV',
    });
  }
}

/**
 * Consulta la tasa vigente más reciente para una moneda (USD por defecto).
 */
export class GetTasaVigenteUseCase {
  constructor(tipoCambioRepository) { this.r = tipoCambioRepository; }

  async execute(moneda_origen_id) {
    const tasa = await this.r.findVigente(moneda_origen_id);
    if (!tasa) throw new Error('No hay tasa registrada para esta moneda');
    return tasa;
  }
}

/**
 * Consulta el historial de tasas con filtros opcionales.
 */
export class GetHistorialTasasUseCase {
  constructor(tipoCambioRepository) { this.r = tipoCambioRepository; }

  async execute(opts) { return this.r.findHistorial(opts); }
}

/**
 * Retorna la tasa válida para una fecha específica (para cotizaciones históricas).
 */
export class GetTasaPorFechaUseCase {
  constructor(tipoCambioRepository) { this.r = tipoCambioRepository; }

  async execute(moneda_origen_id, fecha) {
    const tasa = await this.r.findByFecha(moneda_origen_id, fecha);
    if (!tasa) throw new Error(`Sin tasa registrada para la fecha ${fecha}`);
    return tasa;
  }
}
