import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from '../shared/utils/errors.js';

export const createApp = (routes) => {
  const app = express();

  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  });

  app.use('/api', routes);

  app.use((req, res) => {
    res.status(404).json({
      status: 'error',
      message: 'Ruta no encontrada'
    });
  });

  app.use(errorHandler);

  return app;
};
