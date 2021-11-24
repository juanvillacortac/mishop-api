-- AlterTable
CREATE SEQUENCE "product_priority_seq";
ALTER TABLE "product" ALTER COLUMN "priority" SET DEFAULT nextval('product_priority_seq');
ALTER SEQUENCE "product_priority_seq" OWNED BY "product"."priority";
