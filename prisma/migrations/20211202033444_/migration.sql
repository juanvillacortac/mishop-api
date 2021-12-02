-- AlterTable
ALTER TABLE "shop_account" ADD COLUMN     "status" TEXT NOT NULL DEFAULT E'new',
ALTER COLUMN "paymentMethodsMetadata" SET DEFAULT E'{ "PAYPAL": null, "PAGOMOVIL": null, "ZELLE": null, "CASH": null, "POS": null }';

-- CreateTable
CREATE TABLE "ShopAccountStatusLog" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shopId" INTEGER NOT NULL,

    CONSTRAINT "ShopAccountStatusLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShopAccountStatusLog" ADD CONSTRAINT "ShopAccountStatusLog_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
