-- DropForeignKey
ALTER TABLE "assignee" DROP CONSTRAINT "assignee_technical_request_id_fkey";

-- AddForeignKey
ALTER TABLE "assignee" ADD CONSTRAINT "assignee_technical_request_id_fkey" FOREIGN KEY ("technical_request_id") REFERENCES "technical_request"("technical_request_id") ON DELETE CASCADE ON UPDATE CASCADE;
