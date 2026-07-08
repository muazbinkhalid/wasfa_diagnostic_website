-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.patients (
  auth_user_id uuid,
  portal_enabled boolean NOT NULL DEFAULT false,
  full_name text NOT NULL,
  gender text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  date_of_birth date,
  phone text,
  cnic text UNIQUE,
  address text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  mrn text NOT NULL DEFAULT gen_mrn() UNIQUE,
  is_active boolean DEFAULT true,
  reg_date date DEFAULT CURRENT_DATE,
  father_husband_name text,
  relationship_type text,
  email text,
  age smallint,
  CONSTRAINT patients_pkey PRIMARY KEY (id),
  CONSTRAINT patients_auth_user_id_fkey FOREIGN KEY (auth_user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.visits (
  patient_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  referred_by text,
  visit_date timestamp with time zone NOT NULL DEFAULT now(),
  doctor_name text,
  total_amount numeric NOT NULL DEFAULT '0'::numeric,
  discount numeric NOT NULL DEFAULT '0'::numeric,
  net_amount numeric NOT NULL DEFAULT '0'::numeric,
  payment_status text NOT NULL DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now(),
  reference_name text,
  received_by text,
  printed_by text,
  CONSTRAINT visits_pkey PRIMARY KEY (id),
  CONSTRAINT visits_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id)
);
CREATE TABLE public.tests (
  price numeric NOT NULL DEFAULT '0'::numeric,
  unit text,
  report_type text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  department text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tests_pkey PRIMARY KEY (id)
);
CREATE TABLE public.visit_tests (
  visit_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  test_id uuid NOT NULL DEFAULT gen_random_uuid(),
  price numeric NOT NULL DEFAULT '0'::numeric,
  status text NOT NULL DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT visit_tests_pkey PRIMARY KEY (id),
  CONSTRAINT visit_tests_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES public.visits(id),
  CONSTRAINT visit_tests_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(id)
);
CREATE TABLE public.test_results (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  visit_test_id uuid NOT NULL DEFAULT gen_random_uuid(),
  result-value text,
  result_unit text,
  normal_range text,
  remarks text,
  entered_at timestamp with time zone DEFAULT now(),
  approved boolean DEFAULT false,
  approved_at timestamp with time zone DEFAULT now(),
  CONSTRAINT test_results_pkey PRIMARY KEY (id),
  CONSTRAINT test_results_visit_test_id_fkey FOREIGN KEY (visit_test_id) REFERENCES public.visit_tests(id)
);
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  visit_id uuid NOT NULL DEFAULT gen_random_uuid(),
  receipt_no text NOT NULL UNIQUE,
  amount numeric NOT NULL DEFAULT '0'::numeric,
  discount numeric DEFAULT '0'::numeric,
  paid_amount numeric DEFAULT '0'::numeric,
  payment_method text DEFAULT 'cash'::text,
  payment_status text DEFAULT 'unpaid'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES public.visits(id)
);
CREATE TABLE public.reports (
  test_id uuid,
  patient_id uuid,
  file_path text NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reports_pkey PRIMARY KEY (id),
  CONSTRAINT reports_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id),
  CONSTRAINT reports_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.patient_tests(id)
);
CREATE TABLE public.portal_bulk_setup (
  completed_at timestamp with time zone,
  id boolean NOT NULL DEFAULT true CHECK (id),
  enabled_count integer DEFAULT 0,
  failed_count integer DEFAULT 0,
  CONSTRAINT portal_bulk_setup_pkey PRIMARY KEY (id)
);
CREATE TABLE public.patient_tests (
  patient_id uuid NOT NULL,
  test_advised text,
  sr_no text,
  reference text,
  received_by text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  fee_received numeric DEFAULT 0,
  fee_due numeric DEFAULT 0,
  visit_date timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT patient_tests_pkey PRIMARY KEY (id),
  CONSTRAINT patient_tests_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id)
);
CREATE TABLE public.patient_checkups (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  fee_paid numeric NOT NULL DEFAULT 0 CHECK (fee_paid >= 0::numeric),
  fee_due numeric NOT NULL DEFAULT 0 CHECK (fee_due >= 0::numeric),
  visit_date timestamp with time zone NOT NULL DEFAULT now(),
  patient_id uuid NOT NULL,
  reference text,
  received_by text NOT NULL CHECK (btrim(received_by) <> ''::text),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT patient_checkups_pkey PRIMARY KEY (id),
  CONSTRAINT patient_checkups_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id)
);