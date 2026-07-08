import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://pilicztkqptaijhisvwu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpbGljenRrcXB0YWlqaGlzdnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMDcxMzMsImV4cCI6MjA4MzY4MzEzM30.udG9wdQSHKBRwOlbK-8VpIaeUyMFNpuwYviXYz1nYvc'
)

async function check() {
  const { data, error } = await supabase.from('reports').select('file_path').limit(5)
  console.log(JSON.stringify(data, null, 2))
}

check()
