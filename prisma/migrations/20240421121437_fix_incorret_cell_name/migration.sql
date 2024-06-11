/*
  Warnings:

  - You are about to drop the column `availablity` on the `technical_request_response` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "technical_request_response" DROP COLUMN "availablity",
ADD COLUMN     "availability" TEXT;
