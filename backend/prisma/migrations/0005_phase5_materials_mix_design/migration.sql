-- CreateEnum
CREATE TYPE "MaterialType" AS ENUM ('CEMENT', 'COARSE_AGGREGATE', 'FINE_AGGREGATE', 'WATER', 'ADMIXTURE', 'GEL', 'POZZOLAN', 'SLAG', 'OTHER');

-- CreateEnum
CREATE TYPE "MaterialUnit" AS ENUM ('KG', 'TON', 'LITER', 'CUBIC_METER', 'UNIT');

-- CreateEnum
CREATE TYPE "MaterialPurchaseSource" AS ENUM ('COMMODITY_EXCHANGE', 'FREE_MARKET', 'DIRECT_SUPPLIER', 'INTERNAL', 'OTHER');

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "factoryId" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "materialType" "MaterialType" NOT NULL,
    "name" TEXT NOT NULL,
    "unit" "MaterialUnit" NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "supplierName" TEXT,
    "purchaseSource" "MaterialPurchaseSource",
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MixDesign" (
    "id" TEXT NOT NULL,
    "factoryId" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "concreteGrade" INTEGER NOT NULL,
    "resistanceClass" TEXT,
    "slumpMm" INTEGER,
    "targetStrengthMpa" DECIMAL(12,2),
    "wasteFactorPercent" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "labCostPerM3" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "directMaterialCostPerM3" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "calculatedCostPerM3" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MixDesign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MixDesignItem" (
    "id" TEXT NOT NULL,
    "mixDesignId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL,
    "unit" "MaterialUnit" NOT NULL,
    "unitPriceSnapshot" DECIMAL(12,2) NOT NULL,
    "totalCost" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MixDesignItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Material_factoryId_idx" ON "Material"("factoryId");
CREATE INDEX "Material_ownerUserId_idx" ON "Material"("ownerUserId");
CREATE INDEX "Material_materialType_idx" ON "Material"("materialType");
CREATE INDEX "MixDesign_factoryId_idx" ON "MixDesign"("factoryId");
CREATE INDEX "MixDesign_ownerUserId_idx" ON "MixDesign"("ownerUserId");
CREATE INDEX "MixDesign_concreteGrade_idx" ON "MixDesign"("concreteGrade");
CREATE INDEX "MixDesignItem_mixDesignId_idx" ON "MixDesignItem"("mixDesignId");
CREATE INDEX "MixDesignItem_materialId_idx" ON "MixDesignItem"("materialId");

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Material" ADD CONSTRAINT "Material_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MixDesign" ADD CONSTRAINT "MixDesign_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MixDesign" ADD CONSTRAINT "MixDesign_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MixDesignItem" ADD CONSTRAINT "MixDesignItem_mixDesignId_fkey" FOREIGN KEY ("mixDesignId") REFERENCES "MixDesign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MixDesignItem" ADD CONSTRAINT "MixDesignItem_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
