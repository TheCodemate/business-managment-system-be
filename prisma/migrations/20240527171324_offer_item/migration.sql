/*
  Warnings:

  - You are about to drop the `_OffersToUploadedProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `offer_product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OffersToUploadedProduct" DROP CONSTRAINT "_OffersToUploadedProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_OffersToUploadedProduct" DROP CONSTRAINT "_OffersToUploadedProduct_B_fkey";

-- AlterTable
ALTER TABLE "offers" ADD COLUMN     "uploadedProductUploadedProductId" TEXT;

-- DropTable
DROP TABLE "_OffersToUploadedProduct";

-- DropTable
DROP TABLE "offer_product";

-- CreateTable
CREATE TABLE "offer_item" (
    "offer_item_id" TEXT NOT NULL,
    "offer_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "offer_item_pkey" PRIMARY KEY ("offer_item_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "offer_item_product_id_key" ON "offer_item"("product_id");

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_uploadedProductUploadedProductId_fkey" FOREIGN KEY ("uploadedProductUploadedProductId") REFERENCES "UploadedProduct"("uploaded_product_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_item" ADD CONSTRAINT "offer_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "UploadedProduct"("uploaded_product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_item" ADD CONSTRAINT "offer_item_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("offer_id") ON DELETE CASCADE ON UPDATE CASCADE;
