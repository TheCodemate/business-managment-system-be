/*
  Warnings:

  - You are about to drop the column `product_id` on the `offers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "offers" DROP CONSTRAINT "offers_product_id_fkey";

-- AlterTable
ALTER TABLE "offers" DROP COLUMN "product_id";

-- CreateTable
CREATE TABLE "offer_product" (
    "offer_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "offer_product_pkey" PRIMARY KEY ("offer_id","product_id")
);

-- CreateTable
CREATE TABLE "_OffersToUploadedProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OffersToUploadedProduct_AB_unique" ON "_OffersToUploadedProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_OffersToUploadedProduct_B_index" ON "_OffersToUploadedProduct"("B");

-- AddForeignKey
ALTER TABLE "_OffersToUploadedProduct" ADD CONSTRAINT "_OffersToUploadedProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "offers"("offer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OffersToUploadedProduct" ADD CONSTRAINT "_OffersToUploadedProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "UploadedProduct"("uploaded_product_id") ON DELETE CASCADE ON UPDATE CASCADE;
