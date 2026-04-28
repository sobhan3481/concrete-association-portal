-- CreateEnum
CREATE TYPE "LandOwnershipType" AS ENUM ('OWNED', 'RENTED', 'PARTNERSHIP', 'OTHER');

-- CreateEnum
CREATE TYPE "BatchingPlantType" AS ENUM ('WET', 'DRY', 'HYBRID');

-- CreateEnum
CREATE TYPE "CementPurchaseSource" AS ENUM ('COMMODITY_EXCHANGE', 'FREE_MARKET', 'MIXED');

-- CreateEnum
CREATE TYPE "OperationalStatus" AS ENUM ('ACTIVE', 'SEMI_ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "Factory" (
    "id" TEXT NOT NULL,
    "companyProfileId" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "landAreaSqm" DECIMAL(12,2),
    "landOwnershipType" "LandOwnershipType" NOT NULL,
    "monthlyRentAmount" DECIMAL(12,2),
    "batchingPlantCount" INTEGER,
    "batchingPlantType" "BatchingPlantType",
    "batchingPlantBrand" TEXT,
    "dailyProductionCapacityM3" DECIMAL(12,2),
    "cementSiloCount" INTEGER,
    "cementSiloCapacityTons" DECIMAL(12,2),
    "hasWaterWell" BOOLEAN NOT NULL DEFAULT false,
    "hasLaboratory" BOOLEAN NOT NULL DEFAULT false,
    "hasWeighbridge" BOOLEAN NOT NULL DEFAULT false,
    "cementPurchaseSource" "CementPurchaseSource" NOT NULL DEFAULT 'MIXED',
    "operationalStatus" "OperationalStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Factory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Factory_companyProfileId_idx" ON "Factory"("companyProfileId");
CREATE INDEX "Factory_ownerUserId_idx" ON "Factory"("ownerUserId");

-- AddForeignKey
ALTER TABLE "Factory" ADD CONSTRAINT "Factory_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Factory" ADD CONSTRAINT "Factory_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
