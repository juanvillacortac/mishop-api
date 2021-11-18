/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "image_attachment_normal_key";

-- DropIndex
DROP INDEX "image_attachment_original_key";

-- DropIndex
DROP INDEX "image_attachment_thumbnail_key";

-- AlterTable
ALTER TABLE "category" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "category_slug_key" ON "category"("slug");
