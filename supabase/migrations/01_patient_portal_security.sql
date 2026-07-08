-- 1. Login Throttling Infrastructure
CREATE TABLE IF NOT EXISTS public.portal_login_attempts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    ip_mrn_hash text NOT NULL,
    attempted_at timestamp with time zone DEFAULT now(),
    CONSTRAINT portal_login_attempts_pkey PRIMARY KEY (id)
);

-- Index for quick rate limit queries
CREATE INDEX IF NOT EXISTS idx_portal_login_attempts_hash_time ON public.portal_login_attempts (ip_mrn_hash, attempted_at);

-- 2. Enable Row Level Security (RLS) on all patient-related tables
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_checkups ENABLE ROW LEVEL SECURITY;

-- 3. Define RLS Policies for authenticated patients

-- Patients table: users can only select their own patient record
CREATE POLICY patients_select_own_record
    ON public.patients FOR SELECT
    USING (auth_user_id = auth.uid());

-- Visits table: users can select visits linked to their patient record
CREATE POLICY visits_select_own_record
    ON public.visits FOR SELECT
    USING (patient_id IN (
        SELECT id FROM public.patients WHERE auth_user_id = auth.uid()
    ));

-- Patient Tests table
CREATE POLICY patient_tests_select_own_record
    ON public.patient_tests FOR SELECT
    USING (patient_id IN (
        SELECT id FROM public.patients WHERE auth_user_id = auth.uid()
    ));

-- Patient Checkups table
CREATE POLICY patient_checkups_select_own_record
    ON public.patient_checkups FOR SELECT
    USING (patient_id IN (
        SELECT id FROM public.patients WHERE auth_user_id = auth.uid()
    ));

-- Reports table
CREATE POLICY reports_select_own_record
    ON public.reports FOR SELECT
    USING (patient_id IN (
        SELECT id FROM public.patients WHERE auth_user_id = auth.uid()
    ));

-- Visit Tests table
CREATE POLICY visit_tests_select_own_record
    ON public.visit_tests FOR SELECT
    USING (visit_id IN (
        SELECT id FROM public.visits WHERE patient_id IN (
            SELECT id FROM public.patients WHERE auth_user_id = auth.uid()
        )
    ));

-- Test Results table
CREATE POLICY test_results_select_own_record
    ON public.test_results FOR SELECT
    USING (visit_test_id IN (
        SELECT id FROM public.visit_tests WHERE visit_id IN (
            SELECT id FROM public.visits WHERE patient_id IN (
                SELECT id FROM public.patients WHERE auth_user_id = auth.uid()
            )
        )
    ));

-- Payments table
CREATE POLICY payments_select_own_record
    ON public.payments FOR SELECT
    USING (visit_id IN (
        SELECT id FROM public.visits WHERE patient_id IN (
            SELECT id FROM public.patients WHERE auth_user_id = auth.uid()
        )
    ));
