/*
  Warnings:

  - You are about to drop the column `metaKeywords` on the `Translation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Translation" DROP COLUMN "metaKeywords",
ADD COLUMN     "keywords" TEXT[];
