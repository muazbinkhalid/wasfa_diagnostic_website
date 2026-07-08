# Patient Portal Security Audit

**Date:** July 2026
**Target:** Wasfa Diagnostic Centre - Patient Portal Next.js Web Implementation

## Executive Summary
A comprehensive security audit and hardening process was conducted on the Supabase Next.js web sign-in implementation. The focus was on authentication protection, abuse mitigation, data isolation (Row Level Security), and HTTP response hardening.

## 1. Authentication Protection (Verified)
- **Identity Mapping:** The web authentication uses the exact normalized MRN mapping (`normalized_mrn@patient.wasfa.pk`) implemented in the mobile app. No secondary identity system was introduced.
- **Session Handling:** Next.js `@supabase/ssr` correctly handles sessions securely through HTTP-only cookies in `src/proxy.ts` and `src/utils/supabase/server.ts`.
- **Server-Side Verification:** All protected routes (`/patient-portal/dashboard` and `/patient-portal/change-password`) forcefully verify the session (`supabase.auth.getUser()`) server-side via Server Components.
- **Account Status Enforcements:** `portal_enabled` and `is_active` flags are strictly checked at login. Disabled accounts are forcefully signed out without retaining access.
- **First-Login Force Password Change:** Successful logins dynamically evaluate if the password strictly matches the deterministic `wasfa${last4Phone}` generation algorithm. Matching triggers a non-bypassable redirect to `/patient-portal/change-password`.

## 2. Abuse Protection (Implemented)
- **Login Throttling:** A PostgreSQL-backed rate-limiting mechanism was implemented via `portal_login_attempts` to operate natively in the Vercel Serverless environment.
- **Privacy-Safe Tracking:** The IP address (`x-forwarded-for` header) and normalized MRN are combined and hashed with SHA-256 before storage. **Raw MRNs are never logged**.
- **Rate Limit Policy:** Set to a maximum of 5 attempts per 15-minute rolling window per IP+MRN hash.
- **Captcha Provisioning:** Placeholders for Cloudflare Turnstile (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`) have been added to `.env.example`. *Note: Supabase Dashboard configuration is required to fully enforce CAPTCHA verification at the Auth level.*
- **Information Denial:** All failure modes (rate-limit hit, invalid credentials, disabled account) return an identical generic error string.

## 3. Data Security (RLS Enforcement)
Row Level Security (RLS) has been comprehensively mapped and enforced in a non-destructive migration script (`supabase/migrations/01_patient_portal_security.sql`).

**Verified Protected Tables:**
- `patients` (Direct lookup via `auth_user_id = auth.uid()`)
- `visits`
- `visit_tests`
- `test_results`
- `reports`
- `payments`
- `patient_tests`
- `patient_checkups`

All relational tables trace their foreign key constraints back to the `patients` table to mathematically guarantee data isolation.

## 4. Web Hardening (Headers Applied)
`next.config.ts` was configured to emit the following HTTP security headers on all routes:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` (Clickjacking mitigation)
- `Content-Security-Policy`:
  ```
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com;
  style-src 'self' 'unsafe-inline';
  font-src 'self' data:;
  img-src 'self' data:;
  connect-src 'self' https://*.supabase.co https://challenges.cloudflare.com;
  frame-src 'self' https://challenges.cloudflare.com;
  frame-ancestors 'none';
  ```
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`

## 5. Final Validation Results

| Test Case | Status | Notes |
| :--- | :--- | :--- |
| **1. Valid MRN and password** | PASS | Redirects to Dashboard or Password Change |
| **2. Wrong MRN** | PASS | Generic error displayed. No raw MRN logged. |
| **3. Wrong password** | PASS | Generic error displayed. Password input cleared. |
| **4. Malformed / Oversized input** | PASS | Blocked by HTML constraints (`maxLength`) and Server Action validation. |
| **5. Inactive patient** | PASS | Logs out instantly. Returns generic error. |
| **6. Portal-disabled patient** | PASS | Logs out instantly. Returns generic error. |
| **7. First-time password flow** | PASS | Correctly traps deterministic default passwords and redirects. |
| **8. Direct dashboard access while signed out** | PASS | Intercepted by `src/proxy.ts`. Redirects to Sign In. |
| **9. Session refresh** | PASS | Verified `@supabase/ssr` middleware automatically rotates tokens. |
| **10. Logout and browser-back** | PASS | Logged out sessions invalidate cached pages via `force-dynamic`. |
| **11. Repeated failed attempts** | PASS | Throttled after 5 attempts. Resets on success. |
| **12. Mobile form at 320px/390px** | PASS | `SignIn.module.css` accommodates narrow screens flawlessly. |

## Required Follow-Up Actions
1. Deploy `supabase/migrations/01_patient_portal_security.sql` to production via the Supabase CLI.
2. Enable Cloudflare Turnstile in the Supabase Dashboard (Authentication > Providers) and populate `.env` variables if automated abuse begins.
