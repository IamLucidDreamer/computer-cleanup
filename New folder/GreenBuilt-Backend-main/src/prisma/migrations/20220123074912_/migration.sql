/*
  Warnings:

  - The `documents` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "documents",
ADD COLUMN     "documents" TEXT[];

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "photo" TEXT,
    "qRCodeId" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_title_key" ON "Product"("title");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_qRCodeId_fkey" FOREIGN KEY ("qRCodeId") REFERENCES "QRCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
