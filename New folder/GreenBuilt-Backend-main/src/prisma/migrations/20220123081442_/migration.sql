/*
  Warnings:

  - You are about to drop the column `qRId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_qRId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "qRId",
ADD COLUMN     "qrId" TEXT;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_qrId_fkey" FOREIGN KEY ("qrId") REFERENCES "QRCode"("qrId") ON DELETE SET NULL ON UPDATE CASCADE;
