export interface PatientRecord {
  id: string;
  mrn: string;
  full_name: string;
  gender: string | null;
  age: number | null;
  reg_date: string;
  test_advised: string | null;
}

export interface PatientReport {
  id: string;
  patient_id: string;
  file_path: string;
  created_at: string;
}

export async function fetchMyRecords(): Promise<PatientRecord[]> {
  const { createClient } = await import("./supabase/client");
  const supabase = createClient();

  const { data, error } = await supabase
    .from("patients")
    .select("id, mrn, full_name, gender, age, reg_date, test_advised")
    .order("reg_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchMyReports(): Promise<PatientReport[]> {
  const records = await fetchMyRecords();
  if (records.length === 0) return [];

  const patientIds = records.map((r) => r.id);
  const { createClient } = await import("./supabase/client");
  const supabase = createClient();

  const { data, error } = await supabase
    .from("reports")
    .select("id, patient_id, file_path, created_at")
    .in("patient_id", patientIds)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getReportDownloadUrl(filePath: string): Promise<string> {
  const { createClient } = await import("./supabase/client");
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from("reports")
    .createSignedUrl(filePath, 3600);

  if (error) throw error;
  return data.signedUrl;
}
