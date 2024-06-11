/*
  Warnings:

  - You are about to drop the column `resolved_by_id` on the `technical_request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "technical_request" DROP COLUMN "resolved_by_id";
