/*
  Warnings:

  - The values [FIAT] on the enum `PaymentMethodType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethodType_new" AS ENUM ('PAYPAL', 'PAGOMOVIL', 'ZELLE', 'CASH', 'POS');
ALTER TABLE "shop_account" ALTER COLUMN "paymentMethods" TYPE "PaymentMethodType_new"[] USING ("paymentMethods"::text::"PaymentMethodType_new"[]);
ALTER TABLE "order" ALTER COLUMN "paymentMethod" TYPE "PaymentMethodType_new" USING ("paymentMethod"::text::"PaymentMethodType_new");
ALTER TYPE "PaymentMethodType" RENAME TO "PaymentMethodType_old";
ALTER TYPE "PaymentMethodType_new" RENAME TO "PaymentMethodType";
DROP TYPE "PaymentMethodType_old";
COMMIT;
