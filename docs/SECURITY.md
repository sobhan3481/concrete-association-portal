# Security Baseline (Phase 4)

## Auth & Ownership
- All machinery endpoints require JWT.
- Machinery is owner-scoped by `ownerUserId`.
- Factory ownership is verified before machinery list/create operations.

## Machinery Anti-IDOR Rules
- `GET /api/factories/:factoryId/machinery` and `POST /api/factories/:factoryId/machinery` first verify owned factory.
- `GET/PUT/DELETE /api/machinery/:id` filter by `ownerUserId` and return safe not-found when not owned.
- No public machinery listing across users.

## Data Isolation
- No competitor factory or machinery data leakage.
- Backend enforces ownership checks; frontend filtering is not trusted.

## Validation & Auditing
- Server-side Zod validation for machinery payload.
- Audit logs for `MACHINERY_CREATED`, `MACHINERY_UPDATED`, `MACHINERY_DELETED` include `machineryId`, `factoryId`, and `machineryType`.

## Secrets
- `.env` is not committed.
- `.env.example` contains only local-safe placeholders.
