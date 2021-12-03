-- AlterTable
ALTER TABLE "image_attachment" ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "order" ALTER COLUMN "paymentData" SET DEFAULT E'{}',
ALTER COLUMN "deliveryMethodData" SET DEFAULT E'{}';

-- AlterTable
ALTER TABLE "shop_account" ADD COLUMN     "category" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT;
