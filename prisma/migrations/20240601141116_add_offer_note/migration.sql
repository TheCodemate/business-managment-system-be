/*
  Warnings:

  - Added the required column `offer_note` to the `offers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "offers" ADD COLUMN     "offer_note" TEXT NOT NULL;
