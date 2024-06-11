/*
  Warnings:

  - A unique constraint covering the columns `[product_code]` on the table `UploadedProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UploadedProduct_product_code_key" ON "UploadedProduct"("product_code");
