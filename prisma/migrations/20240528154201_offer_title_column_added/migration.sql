/*
  Warnings:

  - Added the required column `offer_title` to the `offers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "offers" ADD COLUMN     "offer_title" TEXT NOT NULL;
