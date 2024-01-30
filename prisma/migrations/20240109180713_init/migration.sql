-- CreateTable
CREATE TABLE "customer" (
    "customer_id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "company_name" VARCHAR(50),
    "vat_no" VARCHAR(50),
    "project_description" TEXT,
    "country" VARCHAR(50),

    CONSTRAINT "customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "project" (
    "project_id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_description" TEXT,
    "team_member_id" BIGINT,
    "customer_id" BIGINT,

    CONSTRAINT "project_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "team_member" (
    "team_member_id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upadted_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "active_token" VARCHAR(255) NOT NULL,
    "activate_expire_date" BIGINT NOT NULL,

    CONSTRAINT "team_member_pkey" PRIMARY KEY ("team_member_id")
);

-- CreateTable
CREATE TABLE "reset_tokens" (
    "token" VARCHAR(255) NOT NULL,
    "token_expire_date" BIGINT NOT NULL,
    "team_member_id" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "team_member_email_key" ON "team_member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "team_member_active_token_key" ON "team_member"("active_token");

-- CreateIndex
CREATE UNIQUE INDEX "reset_tokens_token_key" ON "reset_tokens"("token");

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_team_member_id_fkey" FOREIGN KEY ("team_member_id") REFERENCES "team_member"("team_member_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reset_tokens" ADD CONSTRAINT "reset_tokens_team_member_id_fkey" FOREIGN KEY ("team_member_id") REFERENCES "team_member"("team_member_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
