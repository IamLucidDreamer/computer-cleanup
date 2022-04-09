-- AlterTable
ALTER TABLE "User" ALTER COLUMN "gender" SET DEFAULT 1;

-- CreateTable
CREATE TABLE "QRCode" (
    "id" SERIAL NOT NULL,
    "qrId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "redeemed" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "QRCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsedQRCode" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "qrId" TEXT NOT NULL,
    "redeemed" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsedQRCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QRCode_qrId_key" ON "QRCode"("qrId");

-- CreateIndex
CREATE UNIQUE INDEX "UsedQRCode_qrId_key" ON "UsedQRCode"("qrId");

-- AddForeignKey
ALTER TABLE "QRCode" ADD CONSTRAINT "QRCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsedQRCode" ADD CONSTRAINT "UsedQRCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsedQRCode" ADD CONSTRAINT "UsedQRCode_qrId_fkey" FOREIGN KEY ("qrId") REFERENCES "QRCode"("qrId") ON DELETE RESTRICT ON UPDATE CASCADE;
