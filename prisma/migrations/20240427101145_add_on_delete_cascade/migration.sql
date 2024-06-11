-- DropForeignKey
ALTER TABLE "TechnicalRequestResolvedBy" DROP CONSTRAINT "TechnicalRequestResolvedBy_technical_request_id_fkey";

-- AddForeignKey
ALTER TABLE "TechnicalRequestResolvedBy" ADD CONSTRAINT "TechnicalRequestResolvedBy_technical_request_id_fkey" FOREIGN KEY ("technical_request_id") REFERENCES "technical_request"("technical_request_id") ON DELETE CASCADE ON UPDATE CASCADE;
