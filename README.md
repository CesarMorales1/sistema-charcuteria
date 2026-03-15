# Sistema de Inventario Charcutería

Backend API desarrollado con **Clean Architecture**, **Screaming Architecture** y **Domain-Driven Design (DDD)**.

## Tecnologías

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT para autenticación
- bcryptjs para encriptación

## Estructura del Proyecto

```
charcuteria-backend/
├── src/
│   ├── shared/                    # Infraestructura compartida
│   │   ├── database/
│   │   │   └── prismaClient.js   # Cliente Prisma singleton
│   │   ├── middleware/
│   │   │   ├── auth.js           # Autenticación JWT
│   │   │   └── auditoria.js      # Auditoría de cambios
│   │   └── utils/
│   │       ├── errors.js         # Manejo de errores
│   │       └── validators.js     # Validadores comunes
│   │
│   ├── inventario/               # Dominio: Inventario
│   │   ├── domain/
│   │   │   ├── entities/         # Entidades de negocio
│   │   │   ├── repositories/     # Interfaces de repositorios
│   │   │   └── use-cases/        # Casos de uso
│   │   ├── application/
│   │   │   ├── services/         # Servicios de aplicación
│   │   │   └── dtos/             # Data Transfer Objects
│   │   ├── infrastructure/
│   │   │   └── repositories/     # Implementación Prisma
│   │   └── presentation/
│   │       ├── controllers/      # Controladores HTTP
│   │       └── routes/           # Rutas Express
│   │
│   ├── compras/                  # Dominio: Compras
│   ├── tasas/                    # Dominio: Tasas de Cambio
│   ├── cuentas_por_pagar/        # Dominio: Cuentas por Pagar
│   ├── usuarios/                 # Dominio: Usuarios y Permisos
│   │
│   ├── presentation/
│   │   └── expressApp.js         # Configuración Express
│   └── main.js                   # Entry point
│
├── prisma/
│   └── schema.prisma             # Esquema de base de datos
├── package.json
├── .env.example
└── README.md
```

## Principios de Arquitectura

### Clean Architecture

- **Domain Layer**: Lógica de negocio pura, independiente de frameworks
- **Application Layer**: Casos de uso y servicios de aplicación
- **Infrastructure Layer**: Implementaciones técnicas (Prisma, etc.)
- **Presentation Layer**: Controllers y rutas HTTP

### Screaming Architecture

Los dominios de negocio son visibles a primera vista:
- `inventario/` - Gestión de productos e inventarios
- `compras/` - Gestión de compras y proveedores
- `tasas/` - Tasas de cambio multimoneda
- `cuentas_por_pagar/` - Facturas y pagos
- `usuarios/` - Autenticación, permisos y auditoría

### Domain-Driven Design

- Entidades de dominio con lógica de negocio
- Repositorios con interfaces en el dominio
- Use Cases que orquestan la lógica de negocio
- DTOs para transferencia de datos

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus valores
```

3. Configurar base de datos PostgreSQL y actualizar DATABASE_URL en .env

4. Generar cliente Prisma:
```bash
npm run prisma:generate
```

5. Ejecutar migraciones:
```bash
npm run prisma:migrate
```

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

### Prisma Studio
```bash
npm run prisma:studio
```

## Características del Sistema

### Multimoneda
- Soporte para VES, USD, COP
- Historial de tasas de cambio
- Conversión automática

### Inventarios Duales
- **Inventario General**: Stock físico real
- **Inventario Legal**: Stock reportable a SENIAT
- Movimientos con trazabilidad completa

### Compras con IVA
- Facturas con IVA configurable
- Notas de crédito
- Reportes SENIAT

### Seguridad y Auditoría
- Autenticación JWT
- Sistema flexible de permisos
- Auditoría completa de cambios
- Registro de IP y user agent

### Cuentas por Pagar
- Gestión de facturas
- Registro de pagos multimoneda
- Control de vencimientos

## Endpoints API

Todos los endpoints están bajo el prefijo `/api`

### Health Check
```
GET /health
```

### Dominios
- `/api/productos` - Gestión de productos
- `/api/inventario` - Consultas de inventario
- `/api/proveedores` - Gestión de proveedores
- `/api/compras` - Gestión de compras
- `/api/monedas` - Consulta de monedas
- `/api/tasas` - Tasas de cambio
- `/api/facturas` - Gestión de facturas
- `/api/pagos` - Registro de pagos
- `/api/usuarios` - Gestión de usuarios
- `/api/auth` - Autenticación
- `/api/permisos` - Consulta de permisos
- `/api/auditoria` - Consulta de auditoría

## Próximos Pasos

1. Implementar lógica de negocio en los use cases
2. Completar implementaciones de repositorios con Prisma
3. Implementar servicios de aplicación
4. Configurar rutas y middlewares en controllers
5. Agregar validaciones con express-validator
6. Implementar tests unitarios y de integración
7. Documentación de API con Swagger/OpenAPI

## Licencia

ISC
