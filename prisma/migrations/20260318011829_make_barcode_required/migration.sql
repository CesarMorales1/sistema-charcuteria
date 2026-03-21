/*
  Warnings:

  - Made the column `codigo_barra` on table `producto` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "producto" ALTER COLUMN "codigo_barra" SET NOT NULL;
