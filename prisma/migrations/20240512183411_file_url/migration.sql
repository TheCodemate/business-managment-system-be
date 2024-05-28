/*
  Warnings:

  - Added the required column `fileUrl` to the `technical_request_files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "technical_request_files" ADD COLUMN     "fileUrl" TEXT NOT NULL;
