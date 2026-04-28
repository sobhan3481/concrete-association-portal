# Architecture (Phase 3)

## Backend Modules
- Auth module (OTP + mobile/password login).
- Member Profile module (owner-only).
- Company Profile module (owner-only).
- Factory module (owner-only CRUD): `GET/POST/PUT/DELETE /api/factories*`.

## Data Model Evolution
- `User` -> one `CompanyProfile` (Phase 2 baseline)
- `CompanyProfile` -> many `Factory` (Phase 3)
- `Factory` stores both:
  - `companyProfileId` for business relation
  - `ownerUserId` for strict ownership filtering and anti-IDOR

## Frontend
- Routes:
  - `/dashboard`
  - `/profile`
  - `/company`
  - `/factories`
  - `/factories/new`
  - `/factories/:id/edit`
- Preview mode mocks all above without backend.

## Future Path
- Phase 4: Machinery management linked per factory.
