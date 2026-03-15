import 'dotenv/config';
import { createApp } from './presentation/expressApp.js';
import { getPrismaClient, disconnectPrisma } from './shared/database/prismaClient.js';
import { Router } from 'express';

// ── Módulo de Usuarios ─────────────────────────────────────────
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

// ── Módulo de Permisos ─────────────────────────────────────────
import { PrismaPermisoRepository } from './permisos/infrastructure/repositories/PrismaPermisoRepository.js';
import { CreatePermisoUseCase } from './permisos/application/use-cases/CreatePermisoUseCase.js';
import { ListPermisosUseCase } from './permisos/application/use-cases/ListPermisosUseCase.js';
import { UpdatePermisoUseCase } from './permisos/application/use-cases/UpdatePermisoUseCase.js';
import { DeletePermisoUseCase } from './permisos/application/use-cases/DeletePermisoUseCase.js';
import { PermisoController } from './permisos/presentation/controllers/PermisoController.js';
import { createPermisoRoutes } from './permisos/presentation/routes/permisoRoutes.js';

// ── Módulo de Proveedores ──────────────────────────────────────
import { PrismaProveedorRepository } from './compras/infrastructure/repositories/PrismaProveedorRepository.js';
import { CreateProveedorUseCase } from './compras/application/use-cases/CreateProveedorUseCase.js';
import { ListProveedoresUseCase } from './compras/application/use-cases/ListProveedoresUseCase.js';
import { GetProveedorUseCase } from './compras/application/use-cases/GetProveedorUseCase.js';
import { UpdateProveedorUseCase } from './compras/application/use-cases/UpdateProveedorUseCase.js';
import { DeleteProveedorUseCase } from './compras/application/use-cases/DeleteProveedorUseCase.js';
import { ProveedorController } from './compras/presentation/controllers/ProveedorController.js';
import { createProveedorRoutes } from './compras/presentation/routes/proveedorRoutes.js';

// ── Módulo de Compras ──────────────────────────────────────────
import { PrismaCompraRepository } from './compras/infrastructure/repositories/PrismaCompraRepository.js';
import { CreateCompraUseCase, ListComprasUseCase, GetCompraUseCase, CambiarEstadoCompraUseCase, CancelarCompraUseCase } from './compras/application/use-cases/comprasUseCases.js';
import { ComprasController } from './compras/presentation/controllers/ComprasController.js';
import { createComprasRoutes } from './compras/presentation/routes/comprasRoutes.js';

// ── Módulo de Inventario ───────────────────────────────────────
import { PrismaProductoRepository } from './inventario/infrastructure/repositories/PrismaProductoRepository.js';
import { CreateProductoUseCase, ListProductosUseCase, GetProductoUseCase, UpdateProductoUseCase, DeleteProductoUseCase, AjustarInventarioUseCase, ListMovimientosUseCase, GetInventarioUseCase } from './inventario/application/use-cases/inventarioUseCases.js';
import { InventarioController } from './inventario/presentation/controllers/InventarioController.js';
import { createInventarioRoutes } from './inventario/presentation/routes/inventarioRoutes.js';

// ── Módulo de TASAS ───────────────────────────────────────────
import { PrismaTipoCambioRepository } from './tasas/infrastructure/repositories/PrismaTipoCambioRepository.js';
import { RegistrarTasaUseCase, GetTasaVigenteUseCase, GetHistorialTasasUseCase, GetTasaPorFechaUseCase } from './tasas/application/use-cases/tasasUseCases.js';
import { TasasController } from './tasas/presentation/controllers/TasasController.js';
import { createTasasRoutes } from './tasas/presentation/routes/tasasRoutes.js';

// ── Módulo de Cuentas por Pagar ────────────────────────────────
import { PrismaFacturaRepository } from './cuentas_por_pagar/infrastructure/repositories/PrismaFacturaRepository.js';
import { PrismaPagoRepository } from './cuentas_por_pagar/infrastructure/repositories/PrismaPagoRepository.js';
import { CreateFacturaUseCase, ListFacturasUseCase, GetFacturaUseCase, DeleteFacturaUseCase, RegistrarPagoUseCase, ListPagosPorFacturaUseCase, SaldoPendienteUseCase } from './cuentas_por_pagar/application/use-cases/cuentasUseCases.js';
import { CuentasPorPagarController } from './cuentas_por_pagar/presentation/controllers/CuentasPorPagarController.js';
import { createCuentasPorPagarRoutes } from './cuentas_por_pagar/presentation/routes/cuentasPorPagarRoutes.js';

const PORT = process.env.PORT || 3000;

const setupDependencies = () => {
  const prisma = getPrismaClient();

  // Usuarios
  const usuarioRepository = new PrismaUsuarioRepository(prisma);
  const usuarioController = new UsuarioController(
    new CreateUsuarioUseCase(usuarioRepository),
    new GetUsuarioUseCase(usuarioRepository),
    new ListUsuariosUseCase(usuarioRepository),
    new UpdateUsuarioUseCase(usuarioRepository),
    new DeleteUsuarioUseCase(usuarioRepository),
    new AssignPermissionsUseCase(usuarioRepository)
  );
  const authController = new AuthController(new LoginUseCase(usuarioRepository));

  // Permisos
  const permisoRepository = new PrismaPermisoRepository(prisma);
  const permisoController = new PermisoController(
    new CreatePermisoUseCase(permisoRepository),
    new ListPermisosUseCase(permisoRepository),
    new UpdatePermisoUseCase(permisoRepository),
    new DeletePermisoUseCase(permisoRepository)
  );

  // Proveedores
  const proveedorRepository = new PrismaProveedorRepository(prisma);
  const proveedorController = new ProveedorController(
    new CreateProveedorUseCase(proveedorRepository),
    new ListProveedoresUseCase(proveedorRepository),
    new GetProveedorUseCase(proveedorRepository),
    new UpdateProveedorUseCase(proveedorRepository),
    new DeleteProveedorUseCase(proveedorRepository)
  );

  // Compras
  const compraRepository = new PrismaCompraRepository(prisma);
  const comprasController = new ComprasController({
    createCompra: new CreateCompraUseCase(compraRepository),
    listCompras:  new ListComprasUseCase(compraRepository),
    getCompra:    new GetCompraUseCase(compraRepository),
    cambiarEstado: new CambiarEstadoCompraUseCase(compraRepository),
    cancelarCompra: new CancelarCompraUseCase(compraRepository),
  });

  // Inventario
  const productoRepository = new PrismaProductoRepository(prisma);
  const inventarioController = new InventarioController({
    createProducto:   new CreateProductoUseCase(productoRepository),
    listProductos:    new ListProductosUseCase(productoRepository),
    getProducto:      new GetProductoUseCase(productoRepository),
    updateProducto:   new UpdateProductoUseCase(productoRepository),
    deleteProducto:   new DeleteProductoUseCase(productoRepository),
    ajustarInventario: new AjustarInventarioUseCase(productoRepository),
    listMovimientos:  new ListMovimientosUseCase(productoRepository),
    getInventario:    new GetInventarioUseCase(productoRepository),
  });

  // Tasas de Cambio
  const tipoCambioRepository = new PrismaTipoCambioRepository(prisma);
  const tasasController = new TasasController({
    registrarTasa:   new RegistrarTasaUseCase(tipoCambioRepository),
    getTasaVigente:  new GetTasaVigenteUseCase(tipoCambioRepository),
    getHistorial:    new GetHistorialTasasUseCase(tipoCambioRepository),
    getTasaPorFecha: new GetTasaPorFechaUseCase(tipoCambioRepository),
  });

  // Cuentas por Pagar
  const facturaRepository = new PrismaFacturaRepository(prisma);
  const pagoRepository    = new PrismaPagoRepository(prisma);
  const cuentasPorPagarController = new CuentasPorPagarController({
    createFactura:  new CreateFacturaUseCase(facturaRepository),
    listFacturas:   new ListFacturasUseCase(facturaRepository),
    getFactura:     new GetFacturaUseCase(facturaRepository),
    deleteFactura:  new DeleteFacturaUseCase(facturaRepository),
    registrarPago:  new RegistrarPagoUseCase(pagoRepository, facturaRepository),
    listPagos:      new ListPagosPorFacturaUseCase(pagoRepository),
    saldoPendiente: new SaldoPendienteUseCase(facturaRepository, pagoRepository),
  });

  return {
    prisma,
    usuarioController,
    authController,
    permisoController,
    proveedorController,
    tasasController,
    comprasController,
    inventarioController,
    cuentasPorPagarController,
  };
};

const setupRoutes = (dependencies) => {
  const router = Router();

  router.use('/auth',             createAuthRoutes(dependencies.authController));
  router.use('/usuarios',         createUsuarioRoutes(dependencies.usuarioController));
  router.use('/permisos',         createPermisoRoutes(dependencies.permisoController));
  router.use('/proveedores',      createProveedorRoutes(dependencies.proveedorController));
  router.use('/compras',          createComprasRoutes(dependencies.comprasController));
  router.use('/inventario',       createInventarioRoutes(dependencies.inventarioController));
  router.use('/facturas',         createCuentasPorPagarRoutes(dependencies.cuentasPorPagarController));
  router.use('/tasas',            createTasasRoutes(dependencies.tasasController));

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
      console.log('📦 Módulos activos: auth, usuarios, permisos, proveedores, compras, inventario, facturas');
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
    process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    await disconnectPrisma();
    process.exit(1);
  }
};

startServer();
