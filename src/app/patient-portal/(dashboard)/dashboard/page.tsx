import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

import { getSecureActiveProfileId } from '@/utils/profile'

export const dynamic = 'force-dynamic'

export default async function DashboardOverviewPage() {
  const activeProfileId = await getSecureActiveProfileId()

  if (!activeProfileId) return null

  const supabase = await createClient()
  const { data: patient } = await supabase
    .from('patients')
    .select('*')
    .eq('id', activeProfileId)
    .single()

  if (!patient) return null

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</div>
            <div className="mt-1 text-sm text-gray-900 font-medium">{patient.full_name}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">MRN</div>
            <div className="mt-1 text-sm text-gray-900">{patient.mrn}</div>
          </div>
          {patient.phone && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</div>
              <div className="mt-1 text-sm text-gray-900">{patient.phone}</div>
            </div>
          )}
          {patient.cnic && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">CNIC</div>
              <div className="mt-1 text-sm text-gray-900">{patient.cnic}</div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-sm text-gray-500 py-4 text-center">
          Overview data will be populated here.
        </div>
      </div>
    </div>
  )
}
