-- CreateTable
CREATE TABLE "contact_person" (
    "contact_person_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT,
    "email" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,

    CONSTRAINT "contact_person_pkey" PRIMARY KEY ("contact_person_id")
);

-- CreateTable
CREATE TABLE "address" (
    "address_id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "street_number" TEXT NOT NULL,
    "apartment_number" TEXT,
    "city" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "post" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("address_id")
);

-- CreateTable
CREATE TABLE "customer" (
    "customer_id" TEXT NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "short_name" VARCHAR(50) NOT NULL,
    "vat_no" VARCHAR(12) NOT NULL,
    "note" TEXT,
    "payment_term" TEXT NOT NULL,
    "payment_type" TEXT NOT NULL,
    "isCompany" BOOLEAN NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "user" (
    "user_id" TEXT NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "activate_token" VARCHAR(255) NOT NULL,
    "activate_token_expire_date" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "product" (
    "product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_description" TEXT NOT NULL,
    "product_code" TEXT NOT NULL,
    "categories" TEXT[],
    "price" DECIMAL(65,30) NOT NULL,
    "stock_amount" INTEGER NOT NULL,
    "producer" TEXT NOT NULL,
    "brand_name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "package" DECIMAL(65,30) NOT NULL,
    "pallete" DECIMAL(65,30) NOT NULL,
    "size_unit" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "thickness" DECIMAL(65,30) NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,
    "weight_unit" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "finish" TEXT NOT NULL,
    "slip_resistance_DIN51097" TEXT[],
    "slip_resistance_DIN51130" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL,
    "updated_date" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "images" TEXT[],

    CONSTRAINT "product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "shopping_cart" (
    "shopping_cart_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "shopping_cart_pkey" PRIMARY KEY ("shopping_cart_id")
);

-- CreateTable
CREATE TABLE "cart_item" (
    "cart_item_id" TEXT NOT NULL,
    "shopping_cart_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cart_item_pkey" PRIMARY KEY ("cart_item_id")
);

-- CreateTable
CREATE TABLE "ResetToken" (
    "reset_token_id" TEXT NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "token_expire_date" BIGINT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "ResetToken_pkey" PRIMARY KEY ("reset_token_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contact_person_customer_id_key" ON "contact_person"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "address_customer_id_key" ON "address"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_vat_no_key" ON "customer"("vat_no");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_activate_token_key" ON "user"("activate_token");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_cart_user_id_key" ON "shopping_cart"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_item_shopping_cart_id_key" ON "cart_item"("shopping_cart_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_item_product_id_key" ON "cart_item"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "ResetToken_token_key" ON "ResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ResetToken_user_id_key" ON "ResetToken"("user_id");

-- AddForeignKey
ALTER TABLE "contact_person" ADD CONSTRAINT "contact_person_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart" ADD CONSTRAINT "shopping_cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_shopping_cart_id_fkey" FOREIGN KEY ("shopping_cart_id") REFERENCES "shopping_cart"("shopping_cart_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResetToken" ADD CONSTRAINT "ResetToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
