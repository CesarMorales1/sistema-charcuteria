import { TipoCambioRepository } from '../../domain/repositories/TipoCambioRepository.js';
import { TipoCambio } from '../../domain/entities/TipoCambio.js';

export class PrismaTipoCambioRepository extends TipoCambioRepository {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  _toDomain(t) {
    if (!t) return null;
    return new TipoCambio({
      id_tipo_cambio:     t.id_tipo_cambio,
      moneda_origen_id:   t.moneda_origen_id,
      moneda_destino_id:  t.moneda_destino_id,
      tasa:               t.tasa,
      fecha_vigencia:     t.fecha_vigencia,
      fecha_fin:          t.fecha_fin,
      hora_actualizacion: t.hora_actualizacion,
      tipo:               t.tipo,
      fuente:             t.fuente,
      variacion_diaria:   t.variacion_diaria,
      moneda_origen:      t.moneda_origen  ?? null,
      moneda_destino:     t.moneda_destino ?? null,
    });
  }

  /**
   * Registra o actualiza la tasa del día.
   * Calcula automáticamente la variación respecto al día anterior.
   * El constraint único es (moneda_origen_id, fecha_vigencia), por lo que
   * si ya existe una tasa para ese par en esa fecha, la actualiza.
   */
  async upsert(tipoCambio) {
    const fecha = new Date(tipoCambio.fecha_vigencia);
    fecha.setUTCHours(0, 0, 0, 0);

    // Buscar la tasa del día anterior para calcular variación
    const ayer = new Date(fecha);
    ayer.setUTCDate(ayer.getUTCDate() - 1);

    const tasaAnterior = await this.prisma.tipoCambio.findFirst({
      where: {
        moneda_origen_id: tipoCambio.moneda_origen_id,
        fecha_vigencia: { lte: ayer },
      },
      orderBy: { fecha_vigencia: 'desc' },
    });

    const variacion_diaria = tasaAnterior
      ? parseFloat((parseFloat(tipoCambio.tasa) - parseFloat(tasaAnterior.tasa)).toFixed(4))
      : null;

    // upsert basado en (moneda_origen_id, fecha_vigencia) — clave única del schema
    const result = await this.prisma.tipoCambio.upsert({
      where: {
        moneda_origen_id_fecha_vigencia: {
          moneda_origen_id: tipoCambio.moneda_origen_id,
          fecha_vigencia: fecha,
        }
      },
      create: {
        moneda_origen_id:    tipoCambio.moneda_origen_id,
        moneda_destino_id:   tipoCambio.moneda_destino_id,
        tasa:                tipoCambio.tasa,
        fecha_vigencia:      fecha,
        hora_actualizacion:  new Date(),
        tipo:                tipoCambio.tipo ?? 'oficial',
        fuente:              tipoCambio.fuente ?? 'BCV',
        variacion_diaria,
      },
      update: {
        tasa:               tipoCambio.tasa,
        hora_actualizacion: new Date(),
        tipo:               tipoCambio.tipo ?? 'oficial',
        fuente:             tipoCambio.fuente ?? 'BCV',
        variacion_diaria,
      },
      include: {
        moneda_origen:  { select: { codigo: true, simbolo: true, nombre: true } },
        moneda_destino: { select: { codigo: true, simbolo: true, nombre: true } },
      }
    });

    return this._toDomain(result);
  }

  /** Tasa vigente más reciente para una moneda de origen (VES como destino). */
  async findVigente(moneda_origen_id) {
    const result = await this.prisma.tipoCambio.findFirst({
      where: { moneda_origen_id: parseInt(moneda_origen_id) },
      orderBy: { fecha_vigencia: 'desc' },
      include: {
        moneda_origen:  { select: { codigo: true, simbolo: true, nombre: true } },
        moneda_destino: { select: { codigo: true, simbolo: true, nombre: true } },
      }
    });
    return this._toDomain(result);
  }

  async findHistorial({ moneda_origen_id, desde, hasta, tipo, page = 1, limit = 30 } = {}) {
    const skip = (page - 1) * limit;
    const where = {
      ...(moneda_origen_id ? { moneda_origen_id: parseInt(moneda_origen_id) } : {}),
      ...(tipo ? { tipo } : {}),
      ...(desde || hasta ? {
        fecha_vigencia: {
          ...(desde ? { gte: new Date(desde) } : {}),
          ...(hasta ? { lte: new Date(hasta)  } : {}),
        }
      } : {}),
    };

    const [tasas, total] = await this.prisma.$transaction([
      this.prisma.tipoCambio.findMany({
        where, skip, take: limit,
        orderBy: { fecha_vigencia: 'desc' },
        include: {
          moneda_origen:  { select: { codigo: true, simbolo: true } },
          moneda_destino: { select: { codigo: true, simbolo: true } },
        }
      }),
      this.prisma.tipoCambio.count({ where })
    ]);

    return {
      data: tasas.map(t => this._toDomain(t)),
      total, page,
      totalPages: Math.ceil(total / limit)
    };
  }

  /** Tasa válida para una fecha específica (busca la más cercana anterior o igual). */
  async findByFecha(moneda_origen_id, fecha) {
    const d = new Date(fecha);
    d.setUTCHours(23, 59, 59, 999);
    const result = await this.prisma.tipoCambio.findFirst({
      where: {
        moneda_origen_id: parseInt(moneda_origen_id),
        fecha_vigencia: { lte: d },
      },
      orderBy: { fecha_vigencia: 'desc' },
      include: {
        moneda_origen:  { select: { codigo: true, simbolo: true } },
        moneda_destino: { select: { codigo: true, simbolo: true } },
      }
    });
    return this._toDomain(result);
  }
}
