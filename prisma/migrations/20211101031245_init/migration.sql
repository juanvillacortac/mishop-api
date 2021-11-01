/*
  Warnings:

  - A unique constraint covering the columns `[original]` on the table `image_attachment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[normal]` on the table `image_attachment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[thumbnail]` on the table `image_attachment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `shop_account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `shop_account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shop_account" ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "hasWhatsapp" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "tiktok" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "image_attachment_original_key" ON "image_attachment"("original");

-- CreateIndex
CREATE UNIQUE INDEX "image_attachment_normal_key" ON "image_attachment"("normal");

-- CreateIndex
CREATE UNIQUE INDEX "image_attachment_thumbnail_key" ON "image_attachment"("thumbnail");

-- CreateIndex
CREATE UNIQUE INDEX "shop_account_slug_key" ON "shop_account"("slug");
