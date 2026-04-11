import { Router } from 'express';
import { authMiddleware } from '../shared/middleware/auth.js';
import { Prisma } from '@prisma/client';

export const createReportesRoutes = (prisma) => {
  const router = Router();

  /**
   * GET /api/reportes/rentabilidad
   * Per-product profitability: purchase cost, revenues, profit, margin.
   */
  router.get('/rentabilidad', authMiddleware, async (req, res) => {
    try {
      const { search = '', id_categoria, page = '1', limit = '20' } = req.query;
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
      const offset = (pageNum - 1) * limitNum;

      const searchParam = `%${search}%`;
      const catId = id_categoria ? parseInt(id_categoria) : null;

      const rows = await prisma.$queryRaw`
        SELECT
          p.id_producto,
          p.nombre,
          p.codigo_barra,
          p.precio_base::float,
          cat.nombre AS categoria,

          COALESCE((
            SELECT AVG(dc.precio_unitario::float)
            FROM detalle_compra dc
            JOIN compra c ON dc.id_compra = c.id_compra
            WHERE dc.id_producto = p.id_producto
              AND c.estado != 'cancelada'
          ), 0) AS costo_promedio,

          COALESCE(SUM(CASE WHEN v.estado != 'anulada' THEN dv.subtotal_linea::float ELSE 0 END), 0) AS ingresos_totales,
          COALESCE(SUM(CASE WHEN v.estado != 'anulada' THEN dv.cantidad::float ELSE 0 END), 0) AS unidades_vendidas

        FROM producto p
        LEFT JOIN categoria_producto cat ON p.id_categoria = cat.id_categoria
        LEFT JOIN detalle_venta dv ON dv.id_producto = p.id_producto
        LEFT JOIN venta v ON dv.id_venta = v.id_venta
        WHERE p.activo = true
          AND (${search} = '' OR p.nombre ILIKE ${searchParam} OR COALESCE(p.codigo_barra, '') ILIKE ${searchParam})
          AND (${catId}::int IS NULL OR p.id_categoria = ${catId}::int)
        GROUP BY p.id_producto, p.nombre, p.codigo_barra, p.precio_base, cat.nombre
        ORDER BY ingresos_totales DESC
        LIMIT ${limitNum} OFFSET ${offset}
      `;

      const countRow = await prisma.$queryRaw`
        SELECT COUNT(DISTINCT p.id_producto)::int AS total
        FROM producto p
        WHERE p.activo = true
          AND (${search} = '' OR p.nombre ILIKE ${searchParam})
          AND (${catId}::int IS NULL OR p.id_categoria = ${catId}::int)
      `;

      const kpiRow = await prisma.$queryRaw`
        SELECT
          COALESCE(SUM(CASE WHEN v.estado != 'anulada' THEN dv.subtotal_linea::float ELSE 0 END), 0) AS total_ingresos
        FROM detalle_venta dv
        JOIN venta v ON dv.id_venta = v.id_venta
      `;

      const totalIngresos = parseFloat(kpiRow[0]?.total_ingresos || 0);

      const data = rows.map(r => {
        const ingresos = parseFloat(r.ingresos_totales);
        const costoUnitario = parseFloat(r.costo_promedio);
        const unidades = parseFloat(r.unidades_vendidas);
        const costoVentas = costoUnitario * unidades;
        const ganancia = ingresos - costoVentas;
        const margen = ingresos > 0 ? (ganancia / ingresos) * 100 : 0;

        return {
          id_producto: r.id_producto,
          nombre: r.nombre,
          codigo_barra: r.codigo_barra,
          categoria: r.categoria || 'Sin categoría',
          precio_base: parseFloat(r.precio_base || 0),
          costo_promedio: costoUnitario,
          ingresos_totales: ingresos,
          unidades_vendidas: unidades,
          ganancia,
          margen_porcentaje: Math.round(margen * 10) / 10,
        };
      });

      // Compute global KPIs from returned data page
      const totalGanancia = data.reduce((acc, r) => acc + r.ganancia, 0);
      const avgMargen = data.length > 0
        ? data.reduce((acc, r) => acc + r.margen_porcentaje, 0) / data.length
        : 0;

      res.json({
        data,
        total: countRow[0]?.total || 0,
        page: pageNum,
        totalPages: Math.ceil((countRow[0]?.total || 0) / limitNum),
        kpis: {
          totalIngresos,
          totalGanancia: Math.round(totalGanancia * 100) / 100,
          margenPromedio: Math.round(avgMargen * 10) / 10,
        },
      });
    } catch (err) {
      console.error('[Reportes] rentabilidad error:', err);
      res.status(500).json({ message: 'Error al generar reporte', error: err.message });
    }
  });

  /**
   * GET /api/reportes/categorias
   * Profitability breakdown by category.
   */
  router.get('/categorias', authMiddleware, async (req, res) => {
    try {
      const rows = await prisma.$queryRaw`
        SELECT
          cat.id_categoria,
          cat.nombre AS categoria,
          COALESCE(SUM(CASE WHEN v.estado != 'anulada' THEN dv.subtotal_linea::float ELSE 0 END), 0) AS ingresos,
          COALESCE(SUM(CASE WHEN v.estado != 'anulada' THEN dv.cantidad::float ELSE 0 END), 0) AS unidades
        FROM categoria_producto cat
        LEFT JOIN producto p ON p.id_categoria = cat.id_categoria AND p.activo = true
        LEFT JOIN detalle_venta dv ON dv.id_producto = p.id_producto
        LEFT JOIN venta v ON dv.id_venta = v.id_venta
        GROUP BY cat.id_categoria, cat.nombre
        ORDER BY ingresos DESC
      `;

      const maxIngresos = Math.max(...rows.map(r => parseFloat(r.ingresos)), 1);

      const data = rows.map(r => {
        const ingresos = parseFloat(r.ingresos);
        return {
          id_categoria: r.id_categoria,
          categoria: r.categoria,
          ingresos,
          unidades: parseFloat(r.unidades),
          porcentaje_relativo: Math.round((ingresos / maxIngresos) * 100),
        };
      });

      res.json({ data });
    } catch (err) {
      console.error('[Reportes] categorias error:', err);
      res.status(500).json({ message: 'Error al obtener categorias', error: err.message });
    }
  });

  return router;
};
