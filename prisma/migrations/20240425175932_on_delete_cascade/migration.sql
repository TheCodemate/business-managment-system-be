-- DropForeignKey
ALTER TABLE "technical_request_response" DROP CONSTRAINT "technical_request_response_technicalRequestId_fkey";

-- AddForeignKey
ALTER TABLE "technical_request_response" ADD CONSTRAINT "technical_request_response_technicalRequestId_fkey" FOREIGN KEY ("technicalRequestId") REFERENCES "technical_request"("technical_request_id") ON DELETE CASCADE ON UPDATE CASCADE;
