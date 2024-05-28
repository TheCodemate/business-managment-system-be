-- DropForeignKey
ALTER TABLE "technical_request" DROP CONSTRAINT "technical_request_resolved_by_id_fkey";

-- DropForeignKey
ALTER TABLE "technical_request_response" DROP CONSTRAINT "technical_request_response_userAccountId_fkey";

-- CreateTable
CREATE TABLE "TechnicalRequestResolvedBy" (
    "user_account_id" TEXT NOT NULL,
    "technical_request_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalRequestResolvedBy_technical_request_id_key" ON "TechnicalRequestResolvedBy"("technical_request_id");

-- AddForeignKey
ALTER TABLE "TechnicalRequestResolvedBy" ADD CONSTRAINT "TechnicalRequestResolvedBy_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalRequestResolvedBy" ADD CONSTRAINT "TechnicalRequestResolvedBy_technical_request_id_fkey" FOREIGN KEY ("technical_request_id") REFERENCES "technical_request"("technical_request_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technical_request_response" ADD CONSTRAINT "technical_request_response_userAccountId_fkey" FOREIGN KEY ("userAccountId") REFERENCES "user_account"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
