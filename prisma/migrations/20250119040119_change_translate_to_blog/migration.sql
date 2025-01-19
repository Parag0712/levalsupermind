/*
  Warnings:

  - Changed the type of `language` on the `Translation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Translation" DROP COLUMN "language",
ADD COLUMN     "language" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Language";

-- CreateIndex
CREATE UNIQUE INDEX "Translation_blogId_language_key" ON "Translation"("blogId", "language");
