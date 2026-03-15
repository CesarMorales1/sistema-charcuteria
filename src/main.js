import 'dotenv/config';
import { createApp } from './presentation/expressApp.js';
import { getPrismaClient, disconnectPrisma } from './shared/database/prismaClient.js';
import { Router } from 'express';

// Módulo de Usuarios
import { PrismaUsuarioRepository } from './usuarios/infrastructure/repositories/PrismaUsuarioRepository.js';
import { CreateUsuarioUseCase } from './usuarios/application/use-cases/CreateUsuarioUseCase.js';
import { GetUsuarioUseCase } from './usuarios/application/use-cases/GetUsuarioUseCase.js';
import { ListUsuariosUseCase } from './usuarios/application/use-cases/ListUsuariosUseCase.js';
import { UpdateUsuarioUseCase } from './usuarios/application/use-cases/UpdateUsuarioUseCase.js';
import { DeleteUsuarioUseCase } from './usuarios/application/use-cases/DeleteUsuarioUseCase.js';
import { AssignPermissionsUseCase } from './usuarios/application/use-cases/AssignPermissionsUseCase.js';
import { LoginUseCase } from './usuarios/application/use-cases/LoginUseCase.js';
import { UsuarioController } from './usuarios/presentation/controllers/UsuarioController.js';
import { AuthController } from './usuarios/presentation/controllers/AuthController.js';
import { createUsuarioRoutes } from './usuarios/presentation/routes/usuarioRoutes.js';
import { createAuthRoutes } from './usuarios/presentation/routes/authRoutes.js';

// Módulo de Permisos
import { PrismaPermisoRepository } from './permisos/infrastructure/repositories/PrismaPermisoRepository.js';
import { CreatePermisoUseCase } from './permisos/application/use-cases/CreatePermisoUseCase.js';
import { ListPermisosUseCase } from './permisos/application/use-cases/ListPermisosUseCase.js';
import { UpdatePermisoUseCase } from './permisos/application/use-cases/UpdatePermisoUseCase.js';
import { DeletePermisoUseCase } from './permisos/application/use-cases/DeletePermisoUseCase.js';
import { PermisoController } from './permisos/presentation/controllers/PermisoController.js';
import { createPermisoRoutes } from './permisos/presentation/routes/permisoRoutes.js';

// Módulo de Proveedores (contexto Compras)
import { PrismaProveedorRepository } from './compras/infrastructure/repositories/PrismaProveedorRepository.js';
import { CreateProveedorUseCase } from './compras/application/use-cases/CreateProveedorUseCase.js';
import { ListProveedoresUseCase } from './compras/application/use-cases/ListProveedoresUseCase.js';
import { GetProveedorUseCase } from './compras/application/use-cases/GetProveedorUseCase.js';
import { UpdateProveedorUseCase } from './compras/application/use-cases/UpdateProveedorUseCase.js';
import { DeleteProveedorUseCase } from './compras/application/use-cases/DeleteProveedorUseCase.js';
import { ProveedorController } from './compras/presentation/controllers/ProveedorController.js';
import { createProveedorRoutes } from './compras/presentation/routes/proveedorRoutes.js';

const PORT = process.env.PORT || 3000;

const setupDependencies = () => {
  const prisma = getPrismaClient();

  // Instancias de Usuarios
  const usuarioRepository = new PrismaUsuarioRepository(prisma);

  const createUsuarioUseCase = new CreateUsuarioUseCase(usuarioRepository);
  const getUsuarioUseCase = new GetUsuarioUseCase(usuarioRepository);
  const listUsuariosUseCase = new ListUsuariosUseCase(usuarioRepository);
  const updateUsuarioUseCase = new UpdateUsuarioUseCase(usuarioRepository);
  const deleteUsuarioUseCase = new DeleteUsuarioUseCase(usuarioRepository);
  const assignPermissionsUseCase = new AssignPermissionsUseCase(usuarioRepository);
  const loginUseCase = new LoginUseCase(usuarioRepository);

  const usuarioController = new UsuarioController(
    createUsuarioUseCase,
    getUsuarioUseCase,
    listUsuariosUseCase,
    updateUsuarioUseCase,
    deleteUsuarioUseCase,
    assignPermissionsUseCase
  );

  const authController = new AuthController(loginUseCase);

  // Instancias de Permisos
  const permisoRepository = new PrismaPermisoRepository(prisma);
  const createPermisoUseCase = new CreatePermisoUseCase(permisoRepository);
  const listPermisosUseCase = new ListPermisosUseCase(permisoRepository);
  const updatePermisoUseCase = new UpdatePermisoUseCase(permisoRepository);
  const deletePermisoUseCase = new DeletePermisoUseCase(permisoRepository);
  const permisoController = new PermisoController(
    createPermisoUseCase,
    listPermisosUseCase,
    updatePermisoUseCase,
    deletePermisoUseCase
  );

  // Instancias de Proveedores
  const proveedorRepository = new PrismaProveedorRepository(prisma);
  const proveedorController = new ProveedorController(
    new CreateProveedorUseCase(proveedorRepository),
    new ListProveedoresUseCase(proveedorRepository),
    new GetProveedorUseCase(proveedorRepository),
    new UpdateProveedorUseCase(proveedorRepository),
    new DeleteProveedorUseCase(proveedorRepository)
  );

  return {
    prisma,
    usuarioController,
    authController,
    permisoController,
    proveedorController
  };
};

const setupRoutes = (dependencies) => {
  const router = Router();

  // Registrar Rutas
  router.use('/auth', createAuthRoutes(dependencies.authController));
  router.use('/usuarios', createUsuarioRoutes(dependencies.usuarioController));
  router.use('/permisos', createPermisoRoutes(dependencies.permisoController));
  router.use('/proveedores', createProveedorRoutes(dependencies.proveedorController));

  return router;
};

const startServer = async () => {
  try {
    const dependencies = setupDependencies();
    const { prisma } = dependencies;

    await prisma.$connect();
    console.log('✅ Conectado a la base de datos');

    const routes = setupRoutes(dependencies);

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
