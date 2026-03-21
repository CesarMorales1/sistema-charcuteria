-- CreateEnum
CREATE TYPE "EstadoVenta" AS ENUM ('abierta', 'cerrada', 'anulada');

-- AlterTable
ALTER TABLE "producto" ADD COLUMN     "precio_base" DECIMAL(12,2) DEFAULT 0,
ALTER COLUMN "codigo_barra" DROP NOT NULL;

-- CreateTable
CREATE TABLE "venta" (
    "id_venta" SERIAL NOT NULL,
    "fecha_venta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "alicuota_iva" DECIMAL(5,2) NOT NULL DEFAULT 16.00,
    "monto_iva" DECIMAL(12,2),
    "total" DECIMAL(12,2) NOT NULL,
    "id_moneda" INTEGER,
    "tasa_referencia" DECIMAL(18,8),
    "reportable_seniat" BOOLEAN NOT NULL DEFAULT false,
    "estado" "EstadoVenta" NOT NULL DEFAULT 'abierta',
    "observacion" TEXT,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "venta_pkey" PRIMARY KEY ("id_venta")
);

-- CreateTable
CREATE TABLE "detalle_venta" (
    "id_detalle" SERIAL NOT NULL,
    "id_venta" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad" DECIMAL(10,3) NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal_linea" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "detalle_venta_pkey" PRIMARY KEY ("id_detalle")
);

-- CreateIndex
CREATE INDEX "idx_venta_fecha" ON "venta"("fecha_venta");

-- CreateIndex
CREATE INDEX "idx_venta_estado" ON "venta"("estado");

-- AddForeignKey
ALTER TABLE "venta" ADD CONSTRAINT "venta_id_moneda_fkey" FOREIGN KEY ("id_moneda") REFERENCES "moneda"("id_moneda") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venta" ADD CONSTRAINT "venta_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_venta" ADD CONSTRAINT "detalle_venta_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "venta"("id_venta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_venta" ADD CONSTRAINT "detalle_venta_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;
