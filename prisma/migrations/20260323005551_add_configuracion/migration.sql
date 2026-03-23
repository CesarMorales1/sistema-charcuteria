-- AlterEnum
ALTER TYPE "TipoMovimiento" ADD VALUE 'inicializacion';

-- CreateTable
CREATE TABLE "configuracion" (
    "clave" VARCHAR(50) NOT NULL,
    "valor" TEXT NOT NULL,
    "descripcion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_pkey" PRIMARY KEY ("clave")
);
