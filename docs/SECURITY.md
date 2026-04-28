# Security Baseline (Phase 2.5)

## Auth
- Primary login: mobile + password.
- OTP endpoints remain available for future SMS integration.
- Registration OTP requirement controlled by `AUTH_REQUIRE_OTP_FOR_REGISTRATION`.

## Authorization & Isolation
- `/api/member-profile/me` and `/api/company-profile/me` require JWT.
- Access is restricted to current user ownership (`userId`).
- No public endpoints expose other members' profile/company data.

## Validation
- Server-side Zod validation for auth/member/company inputs.

## Runtime Safety
- Startup logs explicitly show DB init errors and next-step commands.
- Health endpoint can still be checked even if DB init fails.
- This does not reduce authorization checks; DB-backed APIs will still fail safely if DB is unavailable.

## Secrets
- `.env.example` only contains non-secret placeholders.
- Never commit real `.env` values.
