/*
  Warnings:

  - The primary key for the `offer_item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `offer_item_id` was added to the `offer_item` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "offer_item" DROP CONSTRAINT "offer_item_pkey",
ADD COLUMN     "offer_item_id" TEXT NOT NULL,
ADD CONSTRAINT "offer_item_pkey" PRIMARY KEY ("offer_item_id");
