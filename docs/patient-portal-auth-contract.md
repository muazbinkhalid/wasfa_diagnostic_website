# Phase 1: Patient Portal Authentication Contract

This document outlines the existing authentication contract for the Wasfa patient portal, based on an audit of the mobile app source files, Supabase Edge Functions, database schema, and migration policies.

## 1. MRN Normalization

The Medical Record Number (MRN) is the primary user-facing identifier. It is normalized by stripping all non-alphanumeric characters and converting it to lowercase.

- **Mobile App (`lib/core/config/patient_auth.dart`):**
  `mrn.trim().replaceAll(RegExp(r'[^a-zA-Z0-9]'), '').toLowerCase();`
- **Edge Functions (`create-patient-portal-account` & `bulk-enable-patient-portal`):**
  `mrn.trim().replace(/[^a-zA-Z0-9]/g, "").toLowerCase()`
- **Postgres Database (`public.patient_portal_email`):**
  `lower(regexp_replace(trim(p_mrn), '[^a-zA-Z0-9]', '', 'g'))`

## 2. Supabase Auth Identity Mapping

Supabase Auth uses email addresses for user identities. The normalized MRN is deterministically mapped to a synthetic email address using the `@patient.wasfa.pk` domain:

**Format:** `{normalized_mrn}@patient.wasfa.pk`

When a patient authenticates, Supabase evaluates their identity against this synthetic email. Additional metadata is injected into the user's `app_metadata`:
- `role: "patient"`
- `patient_id: [UUID]`
- `mrn: [original_mrn]`

## 3. Patient Auth Provisioning

Patients cannot self-register. Accounts are provisioned exclusively by staff using Supabase Edge Functions:
- **Single Provisioning:** `supabase/functions/create-patient-portal-account`
- **Bulk Provisioning:** `supabase/functions/bulk-enable-patient-portal`

These functions authenticate the staff member (or service role) and utilize `adminClient.auth.admin.createUser` (or `updateUserById` if an existing auth user needs resetting) with `email_confirm: true` to bypass verification emails.

## 4. `patients.auth_user_id` Linkage

Once the Supabase Auth user is created, its UUID is written back to the `patients` table:
- `patients.auth_user_id` is updated to match the newly generated `auth.users(id)`.
- A foreign key constraint ensures data integrity: `FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE SET NULL`.

## 5. Checking `portal_enabled` and `is_active`

- **`portal_enabled`:** This boolean column on the `patients` table is set to `true` by the edge functions when the patient's account is successfully provisioned. However, there is no explicit RLS policy or edge function check preventing login if this flag is later flipped to `false`.
- **`is_active`:** This boolean column exists on the `patients` table but is **not** currently evaluated within Row Level Security (RLS) policies or Edge Functions during authentication.

## 6. Temporary Password / First-Login State

Upon provisioning, patients are assigned a deterministic default password:
- `wasfa` + the last 4 digits of the patient's phone number.
- If the patient has no phone number on file, it falls back to `wasfa` + normalized MRN (padded to meet the 6-character minimum).

There is **no enforced first-login state** or "force password reset" flag implemented in the database or Edge Functions.

## 7. Handling Password Changes

Patients can change their passwords directly within the mobile application.
- **Source:** `lib/features/profile/profile_screen.dart`
- **Mechanism:** The app calls `SupabaseService.updatePassword(newPassword)`, which executes `client.auth.updateUser(UserAttributes(password: newPassword))`. This relies on the patient already being authenticated.

## 8. RLS Policies Protecting Patient Data

Patient data is shielded by PostgreSQL Row Level Security (RLS), enforced via the `public.is_patient()` and `public.my_patient_ids()` helper functions.

- **`patients`:** `patients select own or staff` — Patients can `SELECT` their own record where `auth_user_id = auth.uid()`.
- **`patient_tests`:** `patient tests select own or staff` — Patients can `SELECT` tests linked to their `patient_id`.
- **`reports` (Database):** `reports select own or staff` — Patients can `SELECT` report metadata linked to their `patient_id`.
- **`storage.objects` (Bucket):** `patients read own report files` — Patients can `SELECT` objects in the `reports` bucket where the `file_path` matches a record in the `reports` table owned by them.
- **Legacy Lab Tables (`visits`, `tests`, `visit_tests`, `test_results`, `payments`):** Locked down entirely to staff only. Patients cannot directly query these tables.

## 9. Reusable Web Flow

To support authentication on the web portal without altering the current contract, the flow should be:
1. Prompt user for their MRN and Password.
2. Normalize the MRN and construct the synthetic email: `lower(replace(mrn, non_alphanumeric)) + '@patient.wasfa.pk'`.
3. Use Supabase `signInWithPassword({ email: synthetic_email, password })`.
4. If successful, Supabase returns the session. `app_metadata` contains `role: "patient"`, confirming it is a patient.
5. The session token is passed in subsequent API calls to access RLS-protected patient data.
6. Similar to the mobile app, provide a UI inside the portal allowing patients to change their password using `supabase.auth.updateUser({ password: newPassword })`.

## 10. Security Gaps and Blockers

- **Deterministic Default Passwords:** The temporary passwords rely on easily guessable information (MRN and phone number). Anyone possessing these two pieces of data can log into a patient's account.
- **No Forced Password Reset:** Patients are not required to change their deterministic passwords upon first login, leaving accounts perpetually vulnerable.
- **Inactive Accounts:** The `is_active` column on the `patients` table is not enforced in RLS. An explicitly deactivated patient can still log in and view their data.
- **No Rate Limiting Documented:** The current contract does not detail rate limiting on the mobile app's login screen, creating vulnerability to brute forcing the 4-digit phone suffixes.

## 11. Required Environment Variables

To fully support the auth flow on any client, the following environment variables are required:
- `NEXT_PUBLIC_SUPABASE_URL` (For web client / edge functions)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (For web client)
- `SUPABASE_SERVICE_ROLE_KEY` (For Edge Functions / Admin tasks only, NEVER EXPOSE to client)

## 12. Relevant Source Locations

- **Mobile App:** `D:\projects\diagnostic_lms\wasfa_patient_app`
  - `lib/core/config/patient_auth.dart`
  - `lib/core/services/supabase_service.dart`
  - `lib/features/auth/login_screen.dart`
  - `lib/features/profile/profile_screen.dart`
- **Database Migrations:** `D:\projects\diagnostic_lms\supabase\migrations`
  - `20260701000000_patient_portal.sql`
  - `20260703000003_security_hardening.sql`
- **Edge Functions:** `D:\projects\diagnostic_lms\supabase\functions`
  - `create-patient-portal-account`
  - `bulk-enable-patient-portal`

## Lint & TypeScript Checks Result

Both the `eslint` check and the `tsc` typecheck were run in the `wasfa_diagnostic_website` project and completed **successfully** with no errors.
