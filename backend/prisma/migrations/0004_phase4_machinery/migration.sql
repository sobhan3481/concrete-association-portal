-- CreateEnum
CREATE TYPE "MachineryType" AS ENUM ('LOADER', 'MIXER', 'DUMP_TRUCK', 'STATIONARY_PUMP', 'BOOM_PUMP');

-- CreateEnum
CREATE TYPE "MachineryOwnershipType" AS ENUM ('OWNED', 'RENTED', 'LEASED', 'OTHER');

-- CreateTable
CREATE TABLE "Machinery" (
    "id" TEXT NOT NULL,
    "factoryId" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "machineryType" "MachineryType" NOT NULL,
    "ownershipType" "MachineryOwnershipType" NOT NULL,
    "title" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "manufactureYear" INTEGER,
    "capacityValue" DECIMAL(12,2),
    "capacityUnit" TEXT,
    "boomLengthMeters" DECIMAL(12,2),
    "monthlyRentAmount" DECIMAL(12,2),
    "depreciationMonthlyAmount" DECIMAL(12,2),
    "fuelCostMonthly" DECIMAL(12,2),
    "maintenanceCostMonthly" DECIMAL(12,2),
    "driverOrOperatorCostMonthly" DECIMAL(12,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Machinery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Machinery_factoryId_idx" ON "Machinery"("factoryId");
CREATE INDEX "Machinery_ownerUserId_idx" ON "Machinery"("ownerUserId");
CREATE INDEX "Machinery_machineryType_idx" ON "Machinery"("machineryType");

-- AddForeignKey
ALTER TABLE "Machinery" ADD CONSTRAINT "Machinery_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Machinery" ADD CONSTRAINT "Machinery_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
