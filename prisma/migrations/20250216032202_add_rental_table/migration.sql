-- CreateTable
CREATE TABLE "Rental" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "borrowerId" TEXT NOT NULL,
    "rentStartDate" TIMESTAMP(3) NOT NULL,
    "rentEndDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rental_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
