# Security Baseline (Phase 1)

- **Password Hashing**: `bcryptjs` with cost factor 12.
- **JWT**: signed access token with configurable expiry.
- **OTP Security**:
  - OTP generated server-side.
  - OTP stored as SHA-256 hash (not plaintext).
  - Expiration, attempt cap, and resend cooldown enforced.
- **Rate Limiting**:
  - `/api/auth/request-otp`: 3 requests/min/IP
  - `/api/auth/login`: 5 requests/min/IP
- **Validation**: request body schema validation via `zod`.
- **Audit Logging**: `OTP_REQUESTED`, `OTP_VERIFIED`, `USER_REGISTERED`, `LOGIN_SUCCESS`, `LOGIN_FAILURE`.
- **CORS**: configurable allowed origin for localhost frontend.
- **Role Seed**: `MEMBER`, `ASSOCIATION_ADMIN`, `SYSTEM_ADMIN` (idempotent upsert).

## Future Hardening
- Per-tenant authorization policies to prevent cross-company access.
- Anti-IDOR checks on all future member/company/factory resources.
- Optional refresh-token rotation and revocation endpoints.
