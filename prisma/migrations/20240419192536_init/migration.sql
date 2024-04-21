-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'LOGISTIC', 'SALES', 'B2B_CLIENT', 'REGULAR_CLIENT');

-- CreateTable
CREATE TABLE "contact_person" (
    "contact_person_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
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
    "is_company" BOOLEAN NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "user_account" (
    "user_id" TEXT NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "activate_token" VARCHAR(255) NOT NULL,
    "activate_token_expire_date" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" DEFAULT 'ADMIN',

    CONSTRAINT "user_account_pkey" PRIMARY KEY ("user_id")
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
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "images" TEXT[],

    CONSTRAINT "product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "shopping_cart" (
    "shopping_car_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "shopping_cart_pkey" PRIMARY KEY ("shopping_car_id")
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
CREATE TABLE "shipping_address" (
    "shipping_address_id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "apartment_number" TEXT,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postal_code" INTEGER NOT NULL,
    "order_details_id" TEXT NOT NULL,

    CONSTRAINT "shipping_address_pkey" PRIMARY KEY ("shipping_address_id")
);

-- CreateTable
CREATE TABLE "shipping_contact" (
    "shipping_contact_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "shipping_address_id" TEXT NOT NULL,

    CONSTRAINT "shipping_contact_pkey" PRIMARY KEY ("shipping_contact_id")
);

-- CreateTable
CREATE TABLE "order_note" (
    "order_note_id" TEXT NOT NULL,
    "note" VARCHAR(500) NOT NULL,
    "order_details_id" TEXT NOT NULL,

    CONSTRAINT "order_note_pkey" PRIMARY KEY ("order_note_id")
);

-- CreateTable
CREATE TABLE "order_details" (
    "order_details_id" TEXT NOT NULL,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "user_account_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_details_pkey" PRIMARY KEY ("order_details_id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "order_item_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "order_details_id" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("order_item_id")
);

-- CreateTable
CREATE TABLE "reset_token" (
    "reset_token_id" TEXT NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "token_expire_date" BIGINT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "reset_token_pkey" PRIMARY KEY ("reset_token_id")
);

-- CreateTable
CREATE TABLE "technical_request" (
    "technical_request_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "additional_info" VARCHAR(3000),
    "product_category" TEXT,
    "files" TEXT,
    "contact_person" TEXT NOT NULL,
    "contact_person_phone" TEXT NOT NULL,
    "contact_person_email" TEXT NOT NULL,
    "collection_name" TEXT NOT NULL,
    "product_code" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "thickness" INTEGER NOT NULL,
    "producer" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "finish" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "user_account_id" TEXT NOT NULL,
    "request_status_id" INTEGER NOT NULL,

    CONSTRAINT "technical_request_pkey" PRIMARY KEY ("technical_request_id")
);

-- CreateTable
CREATE TABLE "assignee" (
    "user_account_id" TEXT NOT NULL,
    "technical_request_id" TEXT NOT NULL,

    CONSTRAINT "assignee_pkey" PRIMARY KEY ("user_account_id","technical_request_id")
);

-- CreateTable
CREATE TABLE "request_type" (
    "technical_request_type_id" INTEGER NOT NULL,
    "type_name" TEXT NOT NULL,

    CONSTRAINT "request_type_pkey" PRIMARY KEY ("technical_request_type_id")
);

-- CreateTable
CREATE TABLE "technical_request_request_type" (
    "technical_request_id" TEXT NOT NULL,
    "technical_request_type_id" INTEGER NOT NULL,

    CONSTRAINT "technical_request_request_type_pkey" PRIMARY KEY ("technical_request_id","technical_request_type_id")
);

-- CreateTable
CREATE TABLE "request_status" (
    "technical_request_status_id" INTEGER NOT NULL,
    "technical_request_status_name" TEXT NOT NULL,

    CONSTRAINT "request_status_pkey" PRIMARY KEY ("technical_request_status_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contact_person_customer_id_key" ON "contact_person"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "address_customer_id_key" ON "address"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_vat_no_key" ON "customer"("vat_no");

-- CreateIndex
CREATE UNIQUE INDEX "user_account_email_key" ON "user_account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_account_activate_token_key" ON "user_account"("activate_token");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_cart_user_id_key" ON "shopping_cart"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_item_product_id_key" ON "cart_item"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "shipping_address_order_details_id_key" ON "shipping_address"("order_details_id");

-- CreateIndex
CREATE UNIQUE INDEX "shipping_contact_shipping_address_id_key" ON "shipping_contact"("shipping_address_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_note_order_details_id_key" ON "order_note"("order_details_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_details_user_account_id_key" ON "order_details"("user_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_item_product_id_key" ON "order_item"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "reset_token_token_key" ON "reset_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "reset_token_user_id_key" ON "reset_token"("user_id");

-- AddForeignKey
ALTER TABLE "contact_person" ADD CONSTRAINT "contact_person_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart" ADD CONSTRAINT "shopping_cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_shopping_cart_id_fkey" FOREIGN KEY ("shopping_cart_id") REFERENCES "shopping_cart"("shopping_car_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_address" ADD CONSTRAINT "shipping_address_order_details_id_fkey" FOREIGN KEY ("order_details_id") REFERENCES "order_details"("order_details_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_contact" ADD CONSTRAINT "shipping_contact_shipping_address_id_fkey" FOREIGN KEY ("shipping_address_id") REFERENCES "shipping_address"("shipping_address_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_note" ADD CONSTRAINT "order_note_order_details_id_fkey" FOREIGN KEY ("order_details_id") REFERENCES "order_details"("order_details_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_details_id_fkey" FOREIGN KEY ("order_details_id") REFERENCES "order_details"("order_details_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reset_token" ADD CONSTRAINT "reset_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technical_request" ADD CONSTRAINT "technical_request_request_status_id_fkey" FOREIGN KEY ("request_status_id") REFERENCES "request_status"("technical_request_status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technical_request" ADD CONSTRAINT "technical_request_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignee" ADD CONSTRAINT "assignee_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignee" ADD CONSTRAINT "assignee_technical_request_id_fkey" FOREIGN KEY ("technical_request_id") REFERENCES "technical_request"("technical_request_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technical_request_request_type" ADD CONSTRAINT "technical_request_request_type_technical_request_id_fkey" FOREIGN KEY ("technical_request_id") REFERENCES "technical_request"("technical_request_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technical_request_request_type" ADD CONSTRAINT "technical_request_request_type_technical_request_type_id_fkey" FOREIGN KEY ("technical_request_type_id") REFERENCES "request_type"("technical_request_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;
