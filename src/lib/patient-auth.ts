/** Converts a patient MRN into the synthetic Supabase Auth email. */
export function patientPortalEmail(mrn: string): string {
  const normalized = mrn.trim().replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  return `${normalized}@patient.wasfa.pk`;
}

export async function signInWithMrn(mrn: string, password: string) {
  const { createClient } = await import("./supabase/client");
  const supabase = createClient();
  const email = patientPortalEmail(mrn);

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  const { createClient } = await import("./supabase/client");
  const supabase = createClient();
  await supabase.auth.signOut();
}
