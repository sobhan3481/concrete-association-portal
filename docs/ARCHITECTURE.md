# Architecture (Phase 5)

## Modules
- Auth
- Member Profile
- Company Profile
- Factory
- Machinery
- Materials
- MixDesign

## Data Relations
- Factory -> many Material
- Factory -> many MixDesign
- MixDesign -> many MixDesignItem
- Material -> many MixDesignItem
- Material/MixDesign store ownerUserId for anti-IDOR

## Cost Baseline
- `directMaterialCostPerM3`: sum of MixDesignItem costs
- `calculatedCostPerM3`: direct + lab + waste
- Final selling price is out of scope

## Future Path
- Phase 6: Production Costs & Overhead Foundation
