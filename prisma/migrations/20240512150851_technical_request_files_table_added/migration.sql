/*
  Warnings:

  - You are about to drop the column `files` on the `technical_request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "technical_request" DROP COLUMN "files";

-- CreateTable
CREATE TABLE "technical_request_files" (
    "gcs_id" TEXT NOT NULL,
    "technical_request_id" TEXT,

    CONSTRAINT "technical_request_files_pkey" PRIMARY KEY ("gcs_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "technical_request_files_gcs_id_key" ON "technical_request_files"("gcs_id");

-- AddForeignKey
ALTER TABLE "technical_request_files" ADD CONSTRAINT "technical_request_files_technical_request_id_fkey" FOREIGN KEY ("technical_request_id") REFERENCES "technical_request"("technical_request_id") ON DELETE SET NULL ON UPDATE CASCADE;
