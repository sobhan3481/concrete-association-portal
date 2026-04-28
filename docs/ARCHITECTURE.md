# Architecture (Phase 4)

## Backend Modules
- Auth module (OTP + mobile/password login).
- Member Profile module (owner-only).
- Company Profile module (owner-only).
- Factory module (owner-only CRUD).
- Machinery module (owner-only CRUD, factory-scoped list/create).

## Data Model Evolution
- `User` -> one `CompanyProfile`
- `CompanyProfile` -> many `Factory`
- `Factory` -> many `Machinery`
- `Factory` and `Machinery` both store `ownerUserId` for strict anti-IDOR filtering.

## API Shape
- Factory-scoped machinery:
  - `GET/POST /api/factories/:factoryId/machinery`
- Machinery item endpoints:
  - `GET/PUT/DELETE /api/machinery/:id`

## Frontend
- Added routes:
  - `/factories/:factoryId/machinery`
  - `/factories/:factoryId/machinery/new`
  - `/machinery/:id/edit`

## Future Path
- Phase 5: Materials & Mix Design Foundation, then cost/pricing layers.
