import 'dotenv/config';
import { createApp } from './presentation/expressApp.js';
import { getPrismaClient, disconnectPrisma } from './shared/database/prismaClient.js';
import { Router } from 'express';

const PORT = process.env.PORT || 3000;

const setupDependencies = () => {
  const prisma = getPrismaClient();

  return {
    prisma
  };
};

const setupRoutes = () => {
  const router = Router();

  return router;
};

const startServer = async () => {
  try {
    const { prisma } = setupDependencies();

    await prisma.$connect();
    console.log('✅ Conectado a la base de datos');

    const routes = setupRoutes();

    const app = createApp(routes);

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
    });

    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} recibido. Cerrando servidor...`);
      server.close(async () => {
        console.log('🛑 Servidor cerrado');
        await disconnectPrisma();
        console.log('🔌 Desconectado de la base de datos');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    await disconnectPrisma();
    process.exit(1);
  }
};

startServer();
