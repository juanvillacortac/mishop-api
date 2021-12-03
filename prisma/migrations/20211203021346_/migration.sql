/*
  Warnings:

  - Added the required column `shopId` to the `customer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "customer_email_key";

-- DropIndex
DROP INDEX "customer_instagram_key";

-- AlterTable
ALTER TABLE "customer" ADD COLUMN     "shopId" TEXT NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL,
ALTER COLUMN "instagram" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
