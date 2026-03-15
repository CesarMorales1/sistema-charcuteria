export class TipoCambioRepository {
  /** Registra la tasa del día. Si ya existe una para (moneda_origen, fecha_vigencia), la actualiza. */
  async upsert(tipoCambio) { throw new Error('Not implemented'); }

  /** Retorna la tasa más reciente para una moneda origen dado (usa VES como destino por defecto). */
  async findVigente(moneda_origen_id) { throw new Error('Not implemented'); }

  /** Historial paginado, opcionalmente filtrado por moneda y rango de fechas. */
  async findHistorial({ moneda_origen_id, desde, hasta, tipo, page, limit } = {}) { throw new Error('Not implemented'); }

  /** Tasa válida para una fecha específica (para cálculos de compras históricas). */
  async findByFecha(moneda_origen_id, fecha) { throw new Error('Not implemented'); }
}
