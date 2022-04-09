/*
  Warnings:

  - You are about to drop the column `qRCodeId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_qRCodeId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "qRCodeId",
ADD COLUMN     "qRId" TEXT;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_qRId_fkey" FOREIGN KEY ("qRId") REFERENCES "QRCode"("qrId") ON DELETE SET NULL ON UPDATE CASCADE;
