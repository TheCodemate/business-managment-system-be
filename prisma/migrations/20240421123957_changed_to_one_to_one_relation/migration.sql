/*
  Warnings:

  - A unique constraint covering the columns `[technicalRequestId]` on the table `technical_request_response` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "technical_request_response_technicalRequestId_key" ON "technical_request_response"("technicalRequestId");
