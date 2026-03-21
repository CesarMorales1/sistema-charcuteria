-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('admin', 'cajero', 'bodega');

-- CreateEnum
CREATE TYPE "AccionAuditoria" AS ENUM ('INSERT', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "TipoTasa" AS ENUM ('oficial', 'paralelo');

-- CreateEnum
CREATE TYPE "EstadoCompra" AS ENUM ('pendiente', 'recibida', 'cancelada');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('entrada', 'salida', 'ajuste', 'nota_credito');

-- CreateEnum
CREATE TYPE "TipoInventario" AS ENUM ('general', 'legal', 'ambos');

-- CreateEnum
CREATE TYPE "EstadoFactura" AS ENUM ('pendiente', 'parcial', 'pagada', 'vencida');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('efectivo', 'transferencia', 'cheque', 'zelle');

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'cajero',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "permiso" (
    "id_permiso" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "modulo" VARCHAR(30),

    CONSTRAINT "permiso_pkey" PRIMARY KEY ("id_permiso")
);

-- CreateTable
CREATE TABLE "usuario_permiso" (
    "id_usuario_permiso" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_permiso" INTEGER NOT NULL,

    CONSTRAINT "usuario_permiso_pkey" PRIMARY KEY ("id_usuario_permiso")
);

-- CreateTable
CREATE TABLE "auditoria" (
    "id_auditoria" SERIAL NOT NULL,
    "tabla" VARCHAR(50) NOT NULL,
    "accion" "AccionAuditoria" NOT NULL,
    "id_registro" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "fecha_cambio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "datos_anteriores" JSONB,
    "datos_nuevos" JSONB,
    "observacion" TEXT,

    CONSTRAINT "auditoria_pkey" PRIMARY KEY ("id_auditoria")
);

-- CreateTable
CREATE TABLE "moneda" (
    "id_moneda" SERIAL NOT NULL,
    "codigo" CHAR(3) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "simbolo" VARCHAR(10),
    "es_principal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "moneda_pkey" PRIMARY KEY ("id_moneda")
);

-- CreateTable
CREATE TABLE "tipo_cambio" (
    "id_tipo_cambio" SERIAL NOT NULL,
    "moneda_origen_id" INTEGER NOT NULL,
    "moneda_destino_id" INTEGER NOT NULL,
    "tasa" DECIMAL(18,8) NOT NULL,
    "fecha_vigencia" DATE NOT NULL,
    "fecha_fin" DATE,
    "hora_actualizacion" TIME,
    "tipo" "TipoTasa" NOT NULL,
    "fuente" VARCHAR(50),
    "variacion_diaria" DECIMAL(10,4),

    CONSTRAINT "tipo_cambio_pkey" PRIMARY KEY ("id_tipo_cambio")
);

-- CreateTable
CREATE TABLE "proveedor" (
    "id_proveedor" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "ruc" VARCHAR(20),
    "telefono" VARCHAR(15),
    "email" VARCHAR(100),
    "direccion" TEXT,
    "terminos_pago" VARCHAR(50),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "proveedor_pkey" PRIMARY KEY ("id_proveedor")
);

-- CreateTable
CREATE TABLE "categoria_producto" (
    "id_categoria" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "categoria_producto_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "unidad_medida" (
    "id_unidad_medida" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "abreviatura" VARCHAR(10) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "unidad_medida_pkey" PRIMARY KEY ("id_unidad_medida")
);

-- CreateTable
CREATE TABLE "producto" (
    "id_producto" SERIAL NOT NULL,
    "codigo_barra" VARCHAR(50),
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "id_categoria" INTEGER NOT NULL,
    "id_unidad_medida" INTEGER NOT NULL,
    "id_moneda_precio" INTEGER,
    "peso_unitario" DECIMAL(8,3),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "producto_pkey" PRIMARY KEY ("id_producto")
);

-- CreateTable
CREATE TABLE "compra" (
    "id_compra" SERIAL NOT NULL,
    "id_proveedor" INTEGER NOT NULL,
    "fecha_compra" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numero_factura" VARCHAR(50),
    "subtotal" DECIMAL(12,2),
    "id_moneda_subtotal" INTEGER,
    "tasa_referencia" DECIMAL(18,8),
    "base_imponible" DECIMAL(12,2),
    "alicuota_iva" DECIMAL(5,2) DEFAULT 16.00,
    "monto_iva" DECIMAL(12,2),
    "total" DECIMAL(12,2) NOT NULL,
    "reportable_seniat" BOOLEAN NOT NULL DEFAULT false,
    "estado" "EstadoCompra" NOT NULL DEFAULT 'pendiente',

    CONSTRAINT "compra_pkey" PRIMARY KEY ("id_compra")
);

-- CreateTable
CREATE TABLE "detalle_compra" (
    "id_detalle" SERIAL NOT NULL,
    "id_compra" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad" DECIMAL(10,3) NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal_linea" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "detalle_compra_pkey" PRIMARY KEY ("id_detalle")
);

-- CreateTable
CREATE TABLE "nota_credito" (
    "id_nota_credito" SERIAL NOT NULL,
    "id_compra" INTEGER NOT NULL,
    "id_detalle_compra" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad" DECIMAL(10,3) NOT NULL,
    "valor_unitario" DECIMAL(10,2),
    "id_moneda" INTEGER,
    "fecha" DATE NOT NULL,
    "observacion" TEXT,

    CONSTRAINT "nota_credito_pkey" PRIMARY KEY ("id_nota_credito")
);

-- CreateTable
CREATE TABLE "movimiento_inventario" (
    "id_movimiento" SERIAL NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "tipo_movimiento" "TipoMovimiento" NOT NULL,
    "tipo_inventario" "TipoInventario" NOT NULL,
    "cantidad" DECIMAL(10,3) NOT NULL,
    "cantidad_anterior" DECIMAL(12,3) NOT NULL,
    "cantidad_nueva" DECIMAL(12,3) NOT NULL,
    "id_origen_tipo" VARCHAR(30),
    "id_origen" INTEGER,
    "id_usuario" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacion" TEXT,

    CONSTRAINT "movimiento_inventario_pkey" PRIMARY KEY ("id_movimiento")
);

-- CreateTable
CREATE TABLE "inventario_general" (
    "id_inventario_gen" SERIAL NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad_actual" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "ubicacion" VARCHAR(50),
    "valor_unitario" DECIMAL(10,2),
    "id_moneda_valor" INTEGER,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventario_general_pkey" PRIMARY KEY ("id_inventario_gen")
);

-- CreateTable
CREATE TABLE "inventario_legal" (
    "id_inventario_legal" SERIAL NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad_actual" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "valor_unitario" DECIMAL(10,2),
    "id_moneda_valor" INTEGER,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventario_legal_pkey" PRIMARY KEY ("id_inventario_legal")
);

-- CreateTable
CREATE TABLE "factura" (
    "id_factura" SERIAL NOT NULL,
    "id_proveedor" INTEGER NOT NULL,
    "id_compra" INTEGER,
    "numero_factura" VARCHAR(50) NOT NULL,
    "fecha_emision" DATE NOT NULL,
    "fecha_vencimiento" DATE NOT NULL,
    "base_imponible" DECIMAL(12,2) NOT NULL,
    "alicuota_iva" DECIMAL(5,2) NOT NULL DEFAULT 16.00,
    "monto_iva" DECIMAL(12,2) NOT NULL,
    "monto_total" DECIMAL(12,2) NOT NULL,
    "id_moneda_monto" INTEGER NOT NULL,
    "tasa_referencia" DECIMAL(18,8),
    "estado" "EstadoFactura" NOT NULL DEFAULT 'pendiente',
    "eliminada" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "factura_pkey" PRIMARY KEY ("id_factura")
);

-- CreateTable
CREATE TABLE "pago" (
    "id_pago" SERIAL NOT NULL,
    "id_factura" INTEGER NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto" DECIMAL(12,2) NOT NULL,
    "id_moneda" INTEGER NOT NULL,
    "tasa_pago" DECIMAL(18,8),
    "metodo_pago" "MetodoPago" NOT NULL,
    "referencia" VARCHAR(100),

    CONSTRAINT "pago_pkey" PRIMARY KEY ("id_pago")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "permiso_nombre_key" ON "permiso"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_permiso_id_usuario_id_permiso_key" ON "usuario_permiso"("id_usuario", "id_permiso");

-- CreateIndex
CREATE INDEX "idx_tabla_registro" ON "auditoria"("tabla", "id_registro");

-- CreateIndex
CREATE INDEX "idx_usuario_fecha" ON "auditoria"("usuario_id", "fecha_cambio");

-- CreateIndex
CREATE INDEX "idx_fecha" ON "auditoria"("fecha_cambio");

-- CreateIndex
CREATE INDEX "idx_historial" ON "tipo_cambio"("fecha_vigencia");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_cambio_moneda_origen_id_fecha_vigencia_key" ON "tipo_cambio"("moneda_origen_id", "fecha_vigencia");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_producto_nombre_key" ON "categoria_producto"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "unidad_medida_nombre_key" ON "unidad_medida"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "unidad_medida_abreviatura_key" ON "unidad_medida"("abreviatura");

-- CreateIndex
CREATE UNIQUE INDEX "producto_codigo_barra_key" ON "producto"("codigo_barra");

-- CreateIndex
CREATE INDEX "idx_seniat" ON "compra"("reportable_seniat", "estado");

-- CreateIndex
CREATE INDEX "idx_proveedor" ON "compra"("id_proveedor");

-- CreateIndex
CREATE UNIQUE INDEX "inventario_general_id_producto_key" ON "inventario_general"("id_producto");

-- CreateIndex
CREATE UNIQUE INDEX "inventario_legal_id_producto_key" ON "inventario_legal"("id_producto");

-- CreateIndex
CREATE UNIQUE INDEX "factura_numero_factura_key" ON "factura"("numero_factura");

-- CreateIndex
CREATE INDEX "idx_proveedor_factura" ON "factura"("id_proveedor", "eliminada");

-- CreateIndex
CREATE INDEX "idx_vencimiento" ON "factura"("fecha_vencimiento");

-- AddForeignKey
ALTER TABLE "usuario_permiso" ADD CONSTRAINT "usuario_permiso_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_permiso" ADD CONSTRAINT "usuario_permiso_id_permiso_fkey" FOREIGN KEY ("id_permiso") REFERENCES "permiso"("id_permiso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditoria" ADD CONSTRAINT "auditoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipo_cambio" ADD CONSTRAINT "tipo_cambio_moneda_origen_id_fkey" FOREIGN KEY ("moneda_origen_id") REFERENCES "moneda"("id_moneda") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipo_cambio" ADD CONSTRAINT "tipo_cambio_moneda_destino_id_fkey" FOREIGN KEY ("moneda_destino_id") REFERENCES "moneda"("id_moneda") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto" ADD CONSTRAINT "producto_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categoria_producto"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto" ADD CONSTRAINT "producto_id_unidad_medida_fkey" FOREIGN KEY ("id_unidad_medida") REFERENCES "unidad_medida"("id_unidad_medida") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto" ADD CONSTRAINT "producto_id_moneda_precio_fkey" FOREIGN KEY ("id_moneda_precio") REFERENCES "moneda"("id_moneda") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compra" ADD CONSTRAINT "compra_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedor"("id_proveedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compra" ADD CONSTRAINT "compra_id_moneda_subtotal_fkey" FOREIGN KEY ("id_moneda_subtotal") REFERENCES "moneda"("id_moneda") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_compra" ADD CONSTRAINT "detalle_compra_id_compra_fkey" FOREIGN KEY ("id_compra") REFERENCES "compra"("id_compra") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_compra" ADD CONSTRAINT "detalle_compra_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nota_credito" ADD CONSTRAINT "nota_credito_id_compra_fkey" FOREIGN KEY ("id_compra") REFERENCES "compra"("id_compra") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nota_credito" ADD CONSTRAINT "nota_credito_id_detalle_compra_fkey" FOREIGN KEY ("id_detalle_compra") REFERENCES "detalle_compra"("id_detalle") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nota_credito" ADD CONSTRAINT "nota_credito_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nota_credito" ADD CONSTRAINT "nota_credito_id_moneda_fkey" FOREIGN KEY ("id_moneda") REFERENCES "moneda"("id_moneda") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimiento_inventario" ADD CONSTRAINT "movimiento_inventario_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimiento_inventario" ADD CONSTRAINT "movimiento_inventario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventario_general" ADD CONSTRAINT "inventario_general_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventario_general" ADD CONSTRAINT "inventario_general_id_moneda_valor_fkey" FOREIGN KEY ("id_moneda_valor") REFERENCES "moneda"("id_moneda") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventario_legal" ADD CONSTRAINT "inventario_legal_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventario_legal" ADD CONSTRAINT "inventario_legal_id_moneda_valor_fkey" FOREIGN KEY ("id_moneda_valor") REFERENCES "moneda"("id_moneda") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedor"("id_proveedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_id_compra_fkey" FOREIGN KEY ("id_compra") REFERENCES "compra"("id_compra") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_id_moneda_monto_fkey" FOREIGN KEY ("id_moneda_monto") REFERENCES "moneda"("id_moneda") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_id_factura_fkey" FOREIGN KEY ("id_factura") REFERENCES "factura"("id_factura") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_id_moneda_fkey" FOREIGN KEY ("id_moneda") REFERENCES "moneda"("id_moneda") ON DELETE RESTRICT ON UPDATE CASCADE;
