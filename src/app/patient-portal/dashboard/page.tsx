import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/patient-portal/sign-in')
  }

  // Verify the patient record and their access state
  const { data: patient, error } = await supabase
    .from('patients')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()

  if (error || !patient) {
    await supabase.auth.signOut()
    redirect('/patient-portal/sign-in?error=Patient record not found')
  }

  if (!patient.portal_enabled) {
    await supabase.auth.signOut()
    redirect('/patient-portal/sign-in?error=Portal access is disabled for this account')
  }

  if (!patient.is_active) {
    await supabase.auth.signOut()
    redirect('/patient-portal/sign-in?error=This patient account is inactive')
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-4">
          <Link
            href="/patient-portal/change-password"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Change Password
          </Link>
          <form action={async () => {
            'use server'
            const sb = await createClient()
            await sb.auth.signOut()
            redirect('/patient-portal/sign-in')
          }}>
            <button
              type="submit"
              className="text-sm font-medium text-red-600 hover:text-red-500"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Patient Information</h2>
          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Full Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{patient.full_name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">MRN</dt>
              <dd className="mt-1 text-sm text-gray-900">{patient.mrn}</dd>
            </div>
            {patient.phone && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{patient.phone}</dd>
              </div>
            )}
            {patient.cnic && (
              <div>
                <dt className="text-sm font-medium text-gray-500">CNIC</dt>
                <dd className="mt-1 text-sm text-gray-900">{patient.cnic}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  )
}
