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
import { UsuarioController } from './usuarios/presentation/controllers/usuarioController.js';
import { AuthController } from './usuarios/presentation/controllers/authController.js';
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
import { ProveedorController } from './compras/presentation/controllers/proveedorController.js';
import { createProveedorRoutes } from './compras/presentation/routes/proveedorRoutes.js';

// ── Módulo de Compras ──────────────────────────────────────────
import { PrismaCompraRepository } from './compras/infrastructure/repositories/PrismaCompraRepository.js';
import { CreateCompraUseCase, ListComprasUseCase, GetCompraUseCase, CambiarEstadoCompraUseCase, CancelarCompraUseCase } from './compras/application/use-cases/comprasUseCases.js';
import { ComprasController } from './compras/presentation/controllers/ComprasController.js';
import { createComprasRoutes } from './compras/presentation/routes/comprasRoutes.js';

// ── Módulo de Inventario ───────────────────────────────────────
import { PrismaProductoRepository } from './inventario/infrastructure/repositories/PrismaProductoRepository.js';
import { PrismaCategoriaRepository } from './inventario/infrastructure/repositories/PrismaCategoriaRepository.js';
import { PrismaUnidadMedidaRepository } from './inventario/infrastructure/repositories/PrismaUnidadMedidaRepository.js';

import {
  CreateProductoUseCase,
  ListProductosUseCase,
  GetProductoUseCase,
  UpdateProductoUseCase,
  DeleteProductoUseCase,
  AjustarInventarioUseCase,
  ListMovimientosUseCase,
  GetInventarioUseCase
} from './inventario/application/use-cases/inventarioUseCases.js';

import {
  ListarCategoriasUseCase,
  GetCategoriaUseCase,
  CrearCategoriaUseCase,
  ActualizarCategoriaUseCase,
  EliminarCategoriaUseCase
} from './inventario/application/use-cases/categoriaUseCases.js';

import {
  ListarUnidadesMedidaUseCase,
  GetUnidadMedidaUseCase,
  CrearUnidadMedidaUseCase,
  ActualizarUnidadMedidaUseCase,
  EliminarUnidadMedidaUseCase
} from './inventario/application/use-cases/unidadMedidaUseCases.js';

import { InventarioController } from './inventario/presentation/controllers/inventarioController.js';
import { createInventarioRoutes } from './inventario/presentation/routes/inventarioRoutes.js';

import { InicializacionController } from './inventario/presentation/controllers/InicializacionController.js';
import { createInicializacionRoutes } from './inventario/presentation/routes/inicializacionRoutes.js';

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

// ── Módulo de Ventas ───────────────────────────────────────────
import { PrismaVentaRepository } from './ventas/infrastructure/repositories/PrismaVentaRepository.js';
import { CreateVentaUseCase, ListVentasUseCase, GetVentaUseCase, AnularVentaUseCase } from './ventas/application/use-cases/ventasUseCases.js';
import { VentasController } from './ventas/presentation/controllers/VentasController.js';
import { createVentasRoutes } from './ventas/presentation/routes/ventasRoutes.js';

const PORT = process.env.PORT || 5000;

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
  const categoriaRepository = new PrismaCategoriaRepository(prisma);
  const unidadMedidaRepository = new PrismaUnidadMedidaRepository(prisma);

  const inicializacionController = new InicializacionController(productoRepository);

  const inventarioController = new InventarioController({
    // Productos
    createProducto:   new CreateProductoUseCase(productoRepository),
    listProductos:    new ListProductosUseCase(productoRepository),
    getProducto:      new GetProductoUseCase(productoRepository),
    updateProducto:   new UpdateProductoUseCase(productoRepository),
    deleteProducto:   new DeleteProductoUseCase(productoRepository),
    ajustarInventario: new AjustarInventarioUseCase(productoRepository),
    listMovimientos:  new ListMovimientosUseCase(productoRepository),
    getInventario:    new GetInventarioUseCase(productoRepository),

    // Categorías
    listCategorias:   new ListarCategoriasUseCase(categoriaRepository),
    getCategoria:     new GetCategoriaUseCase(categoriaRepository),
    createCategoria:  new CrearCategoriaUseCase(categoriaRepository),
    updateCategoria:  new ActualizarCategoriaUseCase(categoriaRepository),
    deleteCategoria:  new EliminarCategoriaUseCase(categoriaRepository),

    // Unidades
    listUnidades:     new ListarUnidadesMedidaUseCase(unidadMedidaRepository),
    getUnidad:        new GetUnidadMedidaUseCase(unidadMedidaRepository),
    createUnidad:     new CrearUnidadMedidaUseCase(unidadMedidaRepository),
    updateUnidad:     new ActualizarUnidadMedidaUseCase(unidadMedidaRepository),
    deleteUnidad:     new EliminarUnidadMedidaUseCase(unidadMedidaRepository),
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

  // Ventas
  const ventaRepository = new PrismaVentaRepository(prisma);
  const ventasController = new VentasController({
    createVenta:  new CreateVentaUseCase(ventaRepository),
    listVentas:   new ListVentasUseCase(ventaRepository),
    getVenta:     new GetVentaUseCase(ventaRepository),
    anularVenta:  new AnularVentaUseCase(ventaRepository),
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
    inicializacionController,
    cuentasPorPagarController,
    ventasController,
  };
};

const setupRoutes = (dependencies) => {
  const router = Router();

  router.use('/auth',             createAuthRoutes(dependencies.authController));
  router.use('/usuarios',         createUsuarioRoutes(dependencies.usuarioController));
  router.use('/permisos',         createPermisoRoutes(dependencies.permisoController));
  router.use('/proveedores',      createProveedorRoutes(dependencies.proveedorController));
  router.use('/compras',          createComprasRoutes(dependencies.comprasController));
  router.use('/inventario/inicializacion', createInicializacionRoutes(dependencies.inicializacionController));
  router.use('/inventario',       createInventarioRoutes(dependencies.inventarioController));
  router.use('/facturas',         createCuentasPorPagarRoutes(dependencies.cuentasPorPagarController));
  router.use('/tasas',            createTasasRoutes(dependencies.tasasController));
  router.use('/ventas',           createVentasRoutes(dependencies.ventasController));

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
      console.log('📦 Módulos activos: auth, usuarios, permisos, proveedores, compras, inventario, facturas, tasas, ventas');
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
