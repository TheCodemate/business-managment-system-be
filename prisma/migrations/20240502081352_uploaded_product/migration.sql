-- CreateTable
CREATE TABLE "UploadedProduct" (
    "uploaded_product_id" TEXT NOT NULL,
    "collection_name" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "ean_code" INTEGER NOT NULL,
    "product_code" TEXT NOT NULL,
    "finish" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,
    "m2_x_pkg" DECIMAL(65,30) NOT NULL,
    "pc_x_pkg" DECIMAL(65,30) NOT NULL,
    "m2_x_plt" DECIMAL(65,30) NOT NULL,
    "unit" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "producer" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "UploadedProduct_pkey" PRIMARY KEY ("uploaded_product_id")
);
