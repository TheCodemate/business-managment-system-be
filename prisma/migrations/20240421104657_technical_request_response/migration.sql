-- AlterTable
ALTER TABLE "technical_request" ADD COLUMN     "resolved" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "technical_request_response" (
    "technical_response_id" TEXT NOT NULL,
    "technical_response_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "availablity" TEXT,
    "technical_documentation" TEXT,
    "purchase_price" TEXT,
    "price" TEXT,
    "substitute" TEXT,
    "production_date" TEXT,
    "userAccountId" TEXT NOT NULL,
    "technicalRequestId" TEXT NOT NULL,

    CONSTRAINT "technical_request_response_pkey" PRIMARY KEY ("technical_response_id")
);

-- AddForeignKey
ALTER TABLE "technical_request_response" ADD CONSTRAINT "technical_request_response_userAccountId_fkey" FOREIGN KEY ("userAccountId") REFERENCES "user_account"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technical_request_response" ADD CONSTRAINT "technical_request_response_technicalRequestId_fkey" FOREIGN KEY ("technicalRequestId") REFERENCES "technical_request"("technical_request_id") ON DELETE RESTRICT ON UPDATE CASCADE;
