-- DropForeignKey
ALTER TABLE "technical_request" DROP CONSTRAINT "technical_request_request_status_id_fkey";

-- AddForeignKey
ALTER TABLE "technical_request" ADD CONSTRAINT "technical_request_request_status_id_fkey" FOREIGN KEY ("request_status_id") REFERENCES "request_status"("technical_request_status_id") ON DELETE CASCADE ON UPDATE CASCADE;
