-- AlterTable
ALTER TABLE "delivery_method" ADD COLUMN     "admitCash" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requestDirection" BOOLEAN NOT NULL DEFAULT false;
