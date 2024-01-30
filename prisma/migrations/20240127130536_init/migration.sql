/*
  Warnings:

  - You are about to drop the column `isCompany` on the `customer` table. All the data in the column will be lost.
  - Added the required column `is_company` to the `customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customer" DROP COLUMN "isCompany",
ADD COLUMN     "is_company" BOOLEAN NOT NULL;
