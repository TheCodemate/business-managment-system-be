-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('m2', 'szt', 'komplet', 'mb');

-- AlterTable
ALTER TABLE "technical_request" ADD COLUMN     "unit" "Unit" NOT NULL DEFAULT 'm2';
