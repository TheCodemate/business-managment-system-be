-- AlterTable
ALTER TABLE "reset_tokens" ADD COLUMN     "reset_token_id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "reset_tokens_pkey" PRIMARY KEY ("reset_token_id");
