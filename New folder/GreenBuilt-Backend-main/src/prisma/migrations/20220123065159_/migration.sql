/*
  Warnings:

  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mobileNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ebServiceNo]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gstin]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "QRCode" DROP CONSTRAINT "QRCode_userId_fkey";

-- DropIndex
DROP INDEX "User_phone_key";

-- AlterTable
ALTER TABLE "QRCode" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "bussinessType" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "companyCode" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "documents" TEXT,
ADD COLUMN     "ebServiceNo" TEXT,
ADD COLUMN     "gstin" TEXT,
ADD COLUMN     "industryType" TEXT,
ADD COLUMN     "mobileNumber" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "state" TEXT,
ALTER COLUMN "role" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobileNumber_key" ON "User"("mobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_ebServiceNo_key" ON "User"("ebServiceNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_gstin_key" ON "User"("gstin");

-- AddForeignKey
ALTER TABLE "QRCode" ADD CONSTRAINT "QRCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
