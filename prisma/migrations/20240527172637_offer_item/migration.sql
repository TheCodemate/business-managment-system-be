/*
  Warnings:

  - The primary key for the `offer_item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `offer_item_id` on the `offer_item` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "offer_item_product_id_key";

-- AlterTable
ALTER TABLE "offer_item" DROP CONSTRAINT "offer_item_pkey",
DROP COLUMN "offer_item_id",
ADD CONSTRAINT "offer_item_pkey" PRIMARY KEY ("offer_id", "product_id");
