# Patient Dashboard Data Contract

## 1. Authentication & Multi-Patient Mapping

### 1.1 Association
The Supabase authentication system issues a session via the `auth.users` table. The `patients` table contains a column `auth_user_id` which acts as a foreign key to `auth.users(id)`.

**Critical Finding**: The `patients.auth_user_id` column does **not** have a `UNIQUE` constraint. This means a single authenticated `auth.users` account can be associated with *multiple* `patients` rows. This explicitly supports a "Family Account" or "Primary Caretaker" model where one email/phone login manages multiple family members' MRNs.

### 1.2 Data Access Security (RLS)
Row Level Security (RLS) policies on patient-facing tables (`visits`, `reports`, `patient_tests`, etc.) must account for this one-to-many relationship.
*   **Incorrect Assumption**: `patient_id = (SELECT id FROM patients WHERE auth_user_id = auth.uid())` (Will fail if multiple rows are returned).
*   **Correct Pattern**: `patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid())`

## 2. Schema Ambiguity & Parallel Paths

The supplied `schema.sql` reveals two parallel tracks for diagnostic data.

### Path A: The "Visit & Granular Test" Track
This path models structured data (potentially LIS integrations where individual biochemical parameters are tracked).
*   **`visits`**: Represents the physical arrival/billing event (`patient_id`, `total_amount`, `payment_status`).
*   **`visit_tests`**: Junction table representing the tests ordered during a specific visit (`visit_id`, `test_id`, `status`).
*   **`test_results`**: Granular parameter results for a specific test (`visit_test_id`, `result-value`, `result_unit`, `normal_range`, `approved`). Note the literal column name `result-value` containing a hyphen.

### Path B: The "Checkups, Tests & PDF Reports" Track
This path appears to be a parallel or legacy structure, potentially used for uploading flat PDF files rather than structured data.
*   **`patient_checkups`**: Tracks consultation/checkup fees independently (`patient_id`, `fee_paid`, `fee_due`).
*   **`patient_tests`**: Tracks high-level test requests independently of `visits` (`patient_id`, `test_advised`, `fee_due`).
*   **`reports`**: Represents uploaded PDF files. 
    *   **Crucial Detail**: `reports.test_id` has a foreign key constraint referencing `patient_tests(id)`, **not** the central `tests` catalog table. It also directly references `patients(id)`.

### Resolution Strategy
The Patient Portal must query *both* paths depending on the feature:
*   **Billing/Visit History**: Must query both `visits` (and linked `payments`) and `patient_checkups`.
*   **Ready Reports / Downloads**: Must query the `reports` table to serve flat PDF files.
*   **Granular Results**: Must query `visits` -> `visit_tests` -> `test_results` where `approved = true`.

## 3. Data Source Queries (Supabase JS)

### 3.1 Profiles
```javascript
// Fetch all profiles managed by this account
const { data: profiles } = await supabase
  .from('patients')
  .select('id, full_name, mrn, date_of_birth, gender')
  .eq('is_active', true)
  .eq('portal_enabled', true)
```

### 3.2 Visits & Checkups
```javascript
// Fetch structured visits
const { data: visits } = await supabase
  .from('visits')
  .select('id, visit_date, doctor_name, payment_status, total_amount')
  .in('patient_id', profileIds)
  .order('visit_date', { ascending: false })

// Fetch parallel checkups
const { data: checkups } = await supabase
  .from('patient_checkups')
  .select('id, visit_date, fee_paid, fee_due')
  .in('patient_id', profileIds)
```

### 3.3 Ready Reports & Downloads (PDFs)
```javascript
const { data: reports } = await supabase
  .from('reports')
  .select(`
    id, 
    created_at, 
    file_path,
    patient_tests ( test_advised )
  `)
  .in('patient_id', profileIds)
  .order('created_at', { ascending: false })
```

### 3.4 Structured Test Results (Pending / Ready)
```javascript
const { data: visitTests } = await supabase
  .from('visit_tests')
  .select(`
    id,
    status,
    tests ( name ),
    visits ( visit_date, doctor_name ),
    test_results ( result-value, result_unit, normal_range, approved )
  `)
  .in('visits.patient_id', profileIds)
```

## 4. Route Structure

To isolate the patient portal from the marketing site's global layout, we will use Next.js Route Groups.

```text
src/app/
├── (marketing)/
│   ├── layout.tsx         # Contains public <Navbar> and <Footer>
│   └── page.tsx           # Moved from src/app/page.tsx
├── patient-portal/
│   ├── page.tsx           # Unauthenticated Sign-In Form (no layout wrapper)
│   ├── layout.tsx         # (Optional) Minimal wrapper if needed
│   └── (dashboard)/
│       ├── layout.tsx     # Dashboard Layout (Sidebar, Topbar, Auth protection)
│       ├── dashboard/     # Unified dashboard view
│       ├── reports/       # Report history and downloads
│       └── settings/      # Password change, multi-patient switching
```

This ensures the marketing Navbar/Footer never leak into the portal.
