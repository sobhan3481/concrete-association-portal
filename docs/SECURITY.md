# Security Baseline (Phase 3)

## Auth & Access
- Factory endpoints all require JWT.
- Member/company/factory resources are owner-scoped.

## Factory Anti-IDOR Rules
- Every factory query filters by `ownerUserId = currentUserId`.
- `GET /api/factories/:id`, `PUT /api/factories/:id`, `DELETE /api/factories/:id` return safe not-found when ownership does not match.
- No public factory listing across users.

## Data Isolation
- No competitor factory data is exposed.
- Backend never relies on frontend-only filtering.

## Validation & Auditing
- Factory input validation is server-side via Zod.
- Audit logs for `FACTORY_CREATED`, `FACTORY_UPDATED`, `FACTORY_DELETED` include `factoryId` and `companyProfileId`.

## Secrets
- `.env` is not committed.
- `.env.example` only includes local-safe placeholders.
