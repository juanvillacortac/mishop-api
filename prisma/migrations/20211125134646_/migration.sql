/*
  Warnings:

  - You are about to drop the column `specificPaymentMethod` on the `delivery_method` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "delivery_method" DROP COLUMN "specificPaymentMethod",
ADD COLUMN     "specificPaymentMethods" "PaymentMethodType"[];
