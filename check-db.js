import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://pilicztkqptaijhisvwu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpbGljenRrcXB0YWlqaGlzdnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMDcxMzMsImV4cCI6MjA4MzY4MzEzM30.udG9wdQSHKBRwOlbK-8VpIaeUyMFNpuwYviXYz1nYvc'
)

async function check() {
  console.log("Checking patients...")
  const { data: patients } = await supabase.from('patients').select('id, full_name, auth_user_id')
  console.log("Patients:", JSON.stringify(patients, null, 2))

  console.log("Checking patient_tests...")
  const { data: tests } = await supabase.from('patient_tests').select('*')
  console.log("Tests:", JSON.stringify(tests, null, 2))

  console.log("Checking patient_checkups...")
  const { data: checkups } = await supabase.from('patient_checkups').select('*')
  console.log("Checkups:", JSON.stringify(checkups, null, 2))

  console.log("Checking reports...")
  const { data: reports } = await supabase.from('reports').select('*')
  console.log("Reports:", JSON.stringify(reports, null, 2))
}

check()
