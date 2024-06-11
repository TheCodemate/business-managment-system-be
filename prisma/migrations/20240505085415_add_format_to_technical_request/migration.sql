/*
  Warnings:

  - You are about to drop the column `height` on the `technical_request` table. All the data in the column will be lost.
  - You are about to drop the column `thickness` on the `technical_request` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `technical_request` table. All the data in the column will be lost.
  - Added the required column `format` to the `technical_request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "technical_request" DROP COLUMN "height",
DROP COLUMN "thickness",
DROP COLUMN "width",
ADD COLUMN     "format" TEXT NOT NULL;
