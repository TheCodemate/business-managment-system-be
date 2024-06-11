/*
  Warnings:

  - You are about to drop the column `resolved_by` on the `technical_request` table. All the data in the column will be lost.
  - Added the required column `resolved_by_id` to the `technical_request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "technical_request" DROP COLUMN "resolved_by",
ADD COLUMN     "resolved_by_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "technical_request" ADD CONSTRAINT "technical_request_resolved_by_id_fkey" FOREIGN KEY ("resolved_by_id") REFERENCES "user_account"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
