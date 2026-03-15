export const auditoriaMiddleware = (tabla) => {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = function (data) {
      if (req.user && (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE')) {
        req.auditoriaData = {
          tabla,
          accion: req.method === 'POST' ? 'INSERT' : req.method === 'PUT' ? 'UPDATE' : 'DELETE',
          id_registro: data?.id || null,
          usuario_id: req.user.id_usuario,
          ip_address: req.ip || req.connection.remoteAddress,
          user_agent: req.get('user-agent'),
          datos_nuevos: req.method !== 'DELETE' ? req.body : null,
          datos_anteriores: req.method === 'PUT' || req.method === 'DELETE' ? req.datosAnteriores : null,
          observacion: req.observacion || null
        };
      }

      return originalJson(data);
    };

    next();
  };
};
