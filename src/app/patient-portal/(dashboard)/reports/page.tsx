import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Download, Clock, FileCheck, FileX } from 'lucide-react'
import { getSecureActiveProfileId } from '@/utils/profile'

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
  const activeProfileId = await getSecureActiveProfileId()

  if (!activeProfileId) return null

  const supabase = await createClient()

  // 1. Fetch ALL tests to find Pending reports
  // "Pending": patient_tests where NO reports exist
  const { data: allTests, error: testsError } = await supabase
    .from('patient_tests')
    .select('id, test_advised, reference, visit_date, reports(id)')
    .eq('patient_id', activeProfileId)
    .order('visit_date', { ascending: false })

  const pendingReports = (allTests || []).filter(t => t.reports && t.reports.length === 0)

  // 2. Fetch Ready Reports
  const { data: readyReports, error: reportsError } = await supabase
    .from('reports')
    .select(`
      id, 
      created_at, 
      patient_tests(test_advised, reference),
      patients(full_name)
    `)
    .eq('patient_id', activeProfileId)
    .order('created_at', { ascending: false })

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Summary Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-[#fff1f2] p-3 rounded-lg text-[#b81d3f]">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{pendingReports.length}</div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Pending Reports</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{readyReports?.length || 0}</div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Available Reports</div>
          </div>
        </div>
      </div>

      {/* Ready Reports Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-600" />
          Ready Reports
        </h2>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {!readyReports || readyReports.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
               <div className="bg-gray-50 text-gray-400 p-3 rounded-full mb-3">
                 <FileX className="w-6 h-6" />
               </div>
               <h3 className="text-sm font-medium text-gray-900 mb-1">No reports available</h3>
               <p className="text-sm text-gray-500">When your lab results are finalised, you can download them here.</p>
             </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#fcfafb] border-b border-gray-100 text-[#4a3f44] font-medium">
                    <tr>
                      <th className="px-6 py-4">Report Name</th>
                      <th className="px-6 py-4">Uploaded Date</th>
                      <th className="px-6 py-4">Patient Profile</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {readyReports.map((report: any) => {
                      const testName = report.patient_tests?.test_advised || report.patient_tests?.reference || 'Diagnostic Report'
                      const patientName = report.patients?.full_name || 'Unknown'
                      
                      return (
                        <tr key={report.id} className="hover:bg-[#fdfafb] transition-colors">
                          <td className="px-6 py-4 text-gray-900 font-medium">
                            {testName}
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {formatDate(report.created_at)}
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {patientName}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <a
                              href={`/api/patient-portal/reports/download?id=${report.id}`}
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#b81d3f] hover:text-[#911631] transition-colors bg-[#fff1f2] hover:bg-[#ffe4e6] px-3 py-1.5 rounded-lg"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </a>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-gray-100">
                {readyReports.map((report: any) => {
                  const testName = report.patient_tests?.test_advised || report.patient_tests?.reference || 'Diagnostic Report'
                  const patientName = report.patients?.full_name || 'Unknown'
                  
                  return (
                    <div key={report.id} className="p-4 hover:bg-[#fdfafb] transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-0.5">{testName}</h4>
                          <p className="text-xs text-gray-500">{formatDate(report.created_at)}</p>
                        </div>
                      </div>
                      <a
                        href={`/api/patient-portal/reports/download?id=${report.id}`}
                        className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#b81d3f] bg-[#fff1f2] active:bg-[#ffe4e6] px-4 py-2.5 rounded-lg transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </a>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Pending Reports Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          Pending Reports
        </h2>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {pendingReports.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
               <h3 className="text-sm font-medium text-gray-900 mb-1">All caught up!</h3>
               <p className="text-sm text-gray-500">There are no pending lab tests awaiting reports.</p>
             </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pendingReports.map((test: any) => (
                <div key={test.id} className="p-4 sm:px-6 hover:bg-[#fdfafb] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-0.5">
                      {test.test_advised || test.reference || 'Lab Test'}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Visit Date: {formatDate(test.visit_date)}
                    </p>
                  </div>
                  <div className="self-start sm:self-auto">
                    <span className="inline-flex items-center text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                      Processing
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
