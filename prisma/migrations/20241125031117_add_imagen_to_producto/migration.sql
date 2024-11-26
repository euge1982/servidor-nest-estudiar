/*
  Warnings:

  - You are about to drop the column `cantidad` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `precio` on the `productos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `productos` DROP COLUMN `cantidad`,
    DROP COLUMN `precio`,
    ADD COLUMN `imagen` VARCHAR(191) NULL;
