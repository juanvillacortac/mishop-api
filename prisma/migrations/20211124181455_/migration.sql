/*
  Warnings:

  - Made the column `paymentMethodsMetadata` on table `shop_account` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "shop_account" ALTER COLUMN "paymentMethodsMetadata" SET NOT NULL,
ALTER COLUMN "paymentMethodsMetadata" SET DEFAULT E'{ "PAYPAL": null, "PAGOMOVIL": null, "ZELLE": null, "FIAT": null }';
