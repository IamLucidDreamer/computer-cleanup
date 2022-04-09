-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dateOfBirth" TEXT,
    "gender" INTEGER DEFAULT 0,
    "phone" TEXT NOT NULL,
    "points" INTEGER DEFAULT 0,
    "encrypted_password" TEXT NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
