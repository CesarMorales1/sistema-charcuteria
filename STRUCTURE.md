# Estructura Completa del Proyecto

## Árbol de Directorios

```
charcuteria-backend/
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── STRUCTURE.md
│
├── prisma/
│   └── schema.prisma                    # Esquema completo con 16 tablas
│
└── src/
    │
    ├── main.js                          # Entry point - Inicia servidor
    │
    ├── shared/                          # Infraestructura compartida
    │   ├── database/
    │   │   └── prismaClient.js         # Singleton Prisma Client
    │   ├── middleware/
    │   │   ├── auth.js                 # JWT authentication + permisos
    │   │   └── auditoria.js            # Auditoría automática
    │   └── utils/
    │       ├── errors.js               # Clases de errores + handler
    │       └── validators.js           # Validadores comunes
    │
    ├── presentation/
    │   └── expressApp.js               # Configuración Express + CORS
    │
    ├── inventario/                     # ============ DOMINIO 1 ============
    │   ├── domain/
    │   │   ├── entities/
    │   │   │   ├── Producto.js
    │   │   │   ├── InventarioGeneral.js
    │   │   │   ├── InventarioLegal.js
    │   │   │   └── MovimientoInventario.js
    │   │   ├── repositories/
    │   │   │   ├── IProductoRepository.js        # Interface
    │   │   │   └── IInventarioRepository.js      # Interface
    │   │   └── use-cases/
    │   │       ├── crearProducto.js
    │   │       └── actualizarInventario.js
    │   ├── application/
    │   │   ├── services/
    │   │   │   ├── ProductoService.js
    │   │   │   └── InventarioService.js
    │   │   └── dtos/
    │   │       ├── ProductoDTO.js
    │   │       └── MovimientoDTO.js
    │   ├── infrastructure/
    │   │   └── repositories/
    │   │       ├── PrismaProductoRepository.js   # Implementación
    │   │       └── PrismaInventarioRepository.js # Implementación
    │   └── presentation/
    │       ├── controllers/
    │       │   ├── productoController.js
    │       │   └── inventarioController.js
    │       └── routes/
    │           ├── productoRoutes.js
    │           └── inventarioRoutes.js
    │
    ├── compras/                        # ============ DOMINIO 2 ============
    │   ├── domain/
    │   │   ├── entities/
    │   │   │   ├── Proveedor.js
    │   │   │   ├── Compra.js
    │   │   │   ├── DetalleCompra.js
    │   │   │   └── NotaCredito.js
    │   │   ├── repositories/
    │   │   │   ├── IProveedorRepository.js
    │   │   │   ├── ICompraRepository.js
    │   │   │   └── INotaCreditoRepository.js
    │   │   └── use-cases/
    │   │       ├── crearCompra.js
    │   │       └── crearNotaCredito.js
    │   ├── application/
    │   │   ├── services/
    │   │   │   ├── ProveedorService.js
    │   │   │   ├── CompraService.js
    │   │   │   └── NotaCreditoService.js
    │   │   └── dtos/
    │   │       ├── ProveedorDTO.js
    │   │       ├── CompraDTO.js
    │   │       └── NotaCreditoDTO.js
    │   ├── infrastructure/
    │   │   └── repositories/
    │   │       ├── PrismaProveedorRepository.js
    │   │       ├── PrismaCompraRepository.js
    │   │       └── PrismaNotaCreditoRepository.js
    │   └── presentation/
    │       ├── controllers/
    │       │   ├── proveedorController.js
    │       │   ├── compraController.js
    │       │   └── notaCreditoController.js
    │       └── routes/
    │           ├── proveedorRoutes.js
    │           ├── compraRoutes.js
    │           └── notaCreditoRoutes.js
    │
    ├── tasas/                          # ============ DOMINIO 3 ============
    │   ├── domain/
    │   │   ├── entities/
    │   │   │   ├── Moneda.js
    │   │   │   └── TipoCambio.js
    │   │   ├── repositories/
    │   │   │   ├── IMonedaRepository.js
    │   │   │   └── ITipoCambioRepository.js
    │   │   └── use-cases/
    │   │       └── actualizarTasa.js
    │   ├── application/
    │   │   ├── services/
    │   │   │   ├── MonedaService.js
    │   │   │   └── TipoCambioService.js
    │   │   └── dtos/
    │   │       └── TipoCambioDTO.js
    │   ├── infrastructure/
    │   │   └── repositories/
    │   │       ├── PrismaMonedaRepository.js
    │   │       └── PrismaTipoCambioRepository.js
    │   └── presentation/
    │       ├── controllers/
    │       │   ├── monedaController.js
    │       │   └── tipoCambioController.js
    │       └── routes/
    │           ├── monedaRoutes.js
    │           └── tipoCambioRoutes.js
    │
    ├── cuentas_por_pagar/              # ============ DOMINIO 4 ============
    │   ├── domain/
    │   │   ├── entities/
    │   │   │   ├── Factura.js
    │   │   │   └── Pago.js
    │   │   ├── repositories/
    │   │   │   ├── IFacturaRepository.js
    │   │   │   └── IPagoRepository.js
    │   │   └── use-cases/
    │   │       ├── crearFactura.js
    │   │       └── registrarPago.js
    │   ├── application/
    │   │   ├── services/
    │   │   │   ├── FacturaService.js
    │   │   │   └── PagoService.js
    │   │   └── dtos/
    │   │       ├── FacturaDTO.js
    │   │       └── PagoDTO.js
    │   ├── infrastructure/
    │   │   └── repositories/
    │   │       ├── PrismaFacturaRepository.js
    │   │       └── PrismaPagoRepository.js
    │   └── presentation/
    │       ├── controllers/
    │       │   ├── facturaController.js
    │       │   └── pagoController.js
    │       └── routes/
    │           ├── facturaRoutes.js
    │           └── pagoRoutes.js
    │
    └── usuarios/                       # ============ DOMINIO 5 ============
        ├── domain/
        │   ├── entities/
        │   │   ├── Usuario.js
        │   │   ├── Permiso.js
        │   │   └── Auditoria.js
        │   ├── repositories/
        │   │   ├── IUsuarioRepository.js
        │   │   ├── IPermisoRepository.js
        │   │   └── IAuditoriaRepository.js
        │   └── use-cases/
        │       ├── crearUsuario.js
        │       └── autenticarUsuario.js
        ├── application/
        │   ├── services/
        │   │   ├── UsuarioService.js
        │   │   ├── AuthService.js
        │   │   ├── PermisoService.js
        │   │   └── AuditoriaService.js
        │   └── dtos/
        │       ├── UsuarioDTO.js
        │       └── AuditoriaDTO.js
        ├── infrastructure/
        │   └── repositories/
        │       ├── PrismaUsuarioRepository.js
        │       ├── PrismaPermisoRepository.js
        │       └── PrismaAuditoriaRepository.js
        └── presentation/
            ├── controllers/
            │   ├── usuarioController.js
            │   ├── authController.js
            │   ├── permisoController.js
            │   └── auditoriaController.js
            └── routes/
                ├── usuarioRoutes.js
                ├── authRoutes.js
                ├── permisoRoutes.js
                └── auditoriaRoutes.js
```

## Estadísticas del Proyecto

- **Total archivos JavaScript**: 104
- **Dominios de negocio**: 5
- **Entidades de dominio**: 14
- **Repositorios**: 10 interfaces + 10 implementaciones
- **Casos de uso**: 8
- **Servicios de aplicación**: 13
- **Controllers**: 15
- **Archivos de rutas**: 15

## Dependencias de Capas

```
┌─────────────────────────────────────────────────────┐
│                  PRESENTATION                       │
│  (Controllers, Routes, Express, HTTP)               │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│                  APPLICATION                        │
│  (Services, DTOs, Use Cases Orchestration)          │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│                    DOMAIN                           │
│  (Entities, Repository Interfaces, Use Cases)       │
│  ⚠️  NO DEPENDE DE NADA EXTERNO                     │
└─────────────────────────────────────────────────────┘
                 ▲
                 │
┌────────────────┴────────────────────────────────────┐
│                INFRASTRUCTURE                       │
│  (Prisma Repositories, Database, External APIs)     │
└─────────────────────────────────────────────────────┘
```

## Flujo de una Request

```
1. HTTP Request
   ↓
2. Express Route (presentation/routes)
   ↓
3. Controller (presentation/controllers)
   ↓
4. Service (application/services)
   ↓
5. Use Case (domain/use-cases)
   ↓
6. Repository Interface (domain/repositories)
   ↓
7. Prisma Repository (infrastructure/repositories)
   ↓
8. Database (PostgreSQL)
   ↓
9. Response ← ← ← ← ← ← ← ← ←
```

## Arquitectura de Base de Datos

### 16 Tablas Implementadas

1. **Usuario** - Usuarios del sistema
2. **Permiso** - Catálogo de permisos
3. **UsuarioPermiso** - Matriz usuario-permiso
4. **Auditoria** - Log completo de cambios
5. **Moneda** - VES, USD, COP
6. **TipoCambio** - Historial de tasas
7. **Proveedor** - Proveedores
8. **Producto** - Catálogo de productos
9. **Compra** - Compras con IVA
10. **DetalleCompra** - Líneas de compra
11. **NotaCredito** - Notas de crédito
12. **MovimientoInventario** - Trazabilidad completa
13. **InventarioGeneral** - Stock físico
14. **InventarioLegal** - Stock SENIAT
15. **Factura** - Facturas por pagar
16. **Pago** - Registro de pagos

### Enums Definidos

- **Rol**: admin, cajero, bodega
- **AccionAuditoria**: INSERT, UPDATE, DELETE
- **TipoTasa**: oficial, paralelo
- **EstadoCompra**: pendiente, recibida, cancelada
- **TipoMovimiento**: entrada, salida, ajuste, nota_credito
- **TipoInventario**: general, legal, ambos
- **EstadoFactura**: pendiente, parcial, pagada, vencida
- **MetodoPago**: efectivo, transferencia, cheque, zelle

## Próximos Pasos de Implementación

1. **Implementar Use Cases**: Lógica de negocio en `domain/use-cases/`
2. **Implementar Repositories**: Queries Prisma en `infrastructure/repositories/`
3. **Implementar Services**: Orquestación en `application/services/`
4. **Configurar Routes**: Endpoints en `presentation/routes/`
5. **Implementar Controllers**: Handlers HTTP en `presentation/controllers/`
6. **Agregar Validaciones**: express-validator en routes
7. **Testing**: Unit tests + Integration tests
8. **Documentación API**: Swagger/OpenAPI

## Convenciones del Código

- **Nombres de archivos**: camelCase para archivos JS
- **Clases**: PascalCase
- **Funciones/métodos**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Interfaces de repositorios**: Prefijo `I` (IUsuarioRepository)
- **Implementaciones Prisma**: Prefijo `Prisma` (PrismaUsuarioRepository)
- **DTOs**: Sufijo `DTO` (CrearUsuarioDTO)
- **Use Cases**: Sufijo `UseCase` (CrearUsuarioUseCase)
