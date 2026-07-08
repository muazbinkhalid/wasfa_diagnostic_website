import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const reportId = searchParams.get('id')

  if (!reportId) {
    return NextResponse.json({ error: 'Missing report ID' }, { status: 400 })
  }

  const supabase = await createClient()

  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Fetch the active profile to ensure we are downloading for the correct context
  const cookieStore = await cookies()
  const activeProfileId = cookieStore.get('wasfa_active_profile')?.value

  if (!activeProfileId) {
    return NextResponse.json({ error: 'No active profile selected' }, { status: 400 })
  }

  // 3. Verify the user owns this profile
  const { data: profileCheck } = await supabase
    .from('patients')
    .select('id')
    .eq('auth_user_id', user.id)
    .eq('id', activeProfileId)
    .single()

  if (!profileCheck) {
    return NextResponse.json({ error: 'Unauthorized profile access' }, { status: 403 })
  }

  // 4. Fetch the report record and ensure it belongs to the active profile
  const { data: report, error: reportError } = await supabase
    .from('reports')
    .select('file_path, patient_id')
    .eq('id', reportId)
    .single()

  if (reportError || !report) {
    return NextResponse.json({ error: 'Report not found or unavailable' }, { status: 404 })
  }

  if (report.patient_id !== activeProfileId) {
    return NextResponse.json({ error: 'Unauthorized report access' }, { status: 403 })
  }

  // 5. Generate Signed URL
  // Assuming 'reports' is the bucket name based on standard Supabase conventions.
  const { data: signedUrlData, error: signedUrlError } = await supabase
    .storage
    .from('reports')
    .createSignedUrl(report.file_path, 60) // 60 seconds expiry

  if (signedUrlError || !signedUrlData?.signedUrl) {
    console.error('Signed URL Error:', signedUrlError)
    // If bucket doesn't exist or file path is invalid
    return NextResponse.json({ error: 'Failed to generate secure download link' }, { status: 500 })
  }

  // 6. Redirect instantly to the secure signed URL
  return NextResponse.redirect(signedUrlData.signedUrl)
}
