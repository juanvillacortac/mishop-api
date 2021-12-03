/*
  Warnings:

  - The primary key for the `customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `delivery_method` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `image_attachment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `order_item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `shop_account` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "ShopAccountStatusLog" DROP CONSTRAINT "ShopAccountStatusLog_shopId_fkey";

-- DropForeignKey
ALTER TABLE "_category_to_product" DROP CONSTRAINT "_category_to_product_B_fkey";

-- DropForeignKey
ALTER TABLE "delivery_method" DROP CONSTRAINT "delivery_method_shopId_fkey";

-- DropForeignKey
ALTER TABLE "image_attachment" DROP CONSTRAINT "image_attachment_productId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_deliveryMethodId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_shopId_fkey";

-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_productId_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_shopId_fkey";

-- DropForeignKey
ALTER TABLE "shop_account" DROP CONSTRAINT "shop_account_logoId_fkey";

-- AlterTable
ALTER TABLE "ShopAccountStatusLog" ALTER COLUMN "shopId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_category_to_product" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "customer" DROP CONSTRAINT "customer_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "customer_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "customer_id_seq";

-- AlterTable
ALTER TABLE "delivery_method" DROP CONSTRAINT "delivery_method_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "shopId" SET DATA TYPE TEXT,
ADD CONSTRAINT "delivery_method_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "delivery_method_id_seq";

-- AlterTable
ALTER TABLE "image_attachment" DROP CONSTRAINT "image_attachment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "productId" SET DATA TYPE TEXT,
ADD CONSTRAINT "image_attachment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "image_attachment_id_seq";

-- AlterTable
ALTER TABLE "order" ALTER COLUMN "customerId" SET DATA TYPE TEXT,
ALTER COLUMN "shopId" SET DATA TYPE TEXT,
ALTER COLUMN "deliveryMethodId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "productId" SET DATA TYPE TEXT,
ADD CONSTRAINT "order_item_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "order_item_id_seq";

-- AlterTable
ALTER TABLE "product" DROP CONSTRAINT "product_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "shopId" SET DATA TYPE TEXT,
ADD CONSTRAINT "product_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "product_id_seq";

-- AlterTable
ALTER TABLE "shop_account" DROP CONSTRAINT "shop_account_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "logoId" SET DATA TYPE TEXT,
ADD CONSTRAINT "shop_account_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "shop_account_id_seq";

-- AddForeignKey
ALTER TABLE "ShopAccountStatusLog" ADD CONSTRAINT "ShopAccountStatusLog_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop_account" ADD CONSTRAINT "shop_account_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "image_attachment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image_attachment" ADD CONSTRAINT "image_attachment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_method" ADD CONSTRAINT "delivery_method_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_deliveryMethodId_fkey" FOREIGN KEY ("deliveryMethodId") REFERENCES "delivery_method"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_category_to_product" ADD FOREIGN KEY ("B") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
