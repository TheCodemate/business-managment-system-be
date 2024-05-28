-- DropForeignKey
ALTER TABLE "technical_request_request_type" DROP CONSTRAINT "technical_request_request_type_technical_request_id_fkey";

-- AddForeignKey
ALTER TABLE "technical_request_request_type" ADD CONSTRAINT "technical_request_request_type_technical_request_id_fkey" FOREIGN KEY ("technical_request_id") REFERENCES "technical_request"("technical_request_id") ON DELETE CASCADE ON UPDATE CASCADE;
