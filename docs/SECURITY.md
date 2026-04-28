# Security Baseline (Phase 5)

## Ownership & Anti-IDOR
- All material/mix-design endpoints require JWT.
- Factory ownership checked before list/create operations.
- Material ownership checked before get/update/delete.
- Mix design ownership checked before get/update/delete/items update.
- Mix design items must reference materials from same owner and same factory.

## Data Isolation
- No public listing for competitor data.
- Backend enforces ownerUserId filtering and safe not-found behavior.

## Validation & Auditing
- Zod validation for material/mix-design/items payloads.
- Audit logs for material and mix design mutations, including items update costs.
