/*
  Warnings:

  - You are about to drop the column `deliveryMethodsMetadata` on the `shop_account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "shop_account" DROP COLUMN "deliveryMethodsMetadata",
ADD COLUMN     "paymentMethodsMetadata" JSONB;
