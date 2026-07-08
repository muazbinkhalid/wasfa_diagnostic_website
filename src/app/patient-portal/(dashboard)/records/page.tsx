import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import RecordsFilterBar from '@/components/portal/RecordsFilterBar'
import RecordsPagination from '@/components/portal/RecordsPagination'
import { getSecureActiveProfileId } from '@/utils/profile'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 10

export default async function RecordsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  
  const activeProfileId = await getSecureActiveProfileId()

  if (!activeProfileId) return null

  const tab = typeof searchParams.tab === 'string' ? searchParams.tab : 'tests'
  const queryText = typeof searchParams.q === 'string' ? searchParams.q : ''
  const month = typeof searchParams.month === 'string' ? searchParams.month : ''
  const pageParam = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1
  const currentPage = !isNaN(pageParam) && pageParam > 0 ? pageParam : 1

  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  let records: any[] = []
  let totalCount = 0

  if (tab === 'tests') {
    let query = supabase
      .from('patient_tests')
      .select('id, test_advised, visit_date, reference, received_by, fee_received, fee_due', { count: 'exact' })
      .eq('patient_id', activeProfileId)
      .order('visit_date', { ascending: false })
      .range(from, to)

    if (queryText) {
      query = query.or(`test_advised.ilike.%${queryText}%,reference.ilike.%${queryText}%`)
    }
    if (month) {
      const startDate = `${month}-01T00:00:00Z`
      // Basic end date calculation for current month (works enough for filtering)
      const [y, m] = month.split('-')
      const nextMonth = m === '12' ? '01' : String(Number(m) + 1).padStart(2, '0')
      const nextYear = m === '12' ? String(Number(y) + 1) : y
      const endDate = `${nextYear}-${nextMonth}-01T00:00:00Z`
      query = query.gte('visit_date', startDate).lt('visit_date', endDate)
    }

    const { data, count } = await query
    records = data || []
    totalCount = count || 0
  } else {
    // checkups tab
    let query = supabase
      .from('patient_checkups')
      .select('id, visit_date, reference, received_by, fee_paid, fee_due', { count: 'exact' })
      .eq('patient_id', activeProfileId)
      .order('visit_date', { ascending: false })
      .range(from, to)

    if (queryText) {
      query = query.ilike('reference', `%${queryText}%`)
    }
    if (month) {
      const startDate = `${month}-01T00:00:00Z`
      const [y, m] = month.split('-')
      const nextMonth = m === '12' ? '01' : String(Number(m) + 1).padStart(2, '0')
      const nextYear = m === '12' ? String(Number(y) + 1) : y
      const endDate = `${nextYear}-${nextMonth}-01T00:00:00Z`
      query = query.gte('visit_date', startDate).lt('visit_date', endDate)
    }

    const { data, count } = await query
    records = data || []
    totalCount = count || 0
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return 'Rs 0'
    return `Rs ${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <RecordsFilterBar />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="bg-[#fdfafb] text-[#b81d3f] p-3 rounded-full mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No records found</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              {queryText || month 
                ? "Try adjusting your search or date filters to find what you're looking for." 
                : `No ${tab} records available for this patient.`}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#fcfafb] border-b border-gray-100 text-[#4a3f44] font-medium">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">{tab === 'tests' ? 'Test Advised' : 'Reference'}</th>
                    <th className="px-6 py-4 hidden lg:table-cell">Received By</th>
                    <th className="px-6 py-4 text-right">{tab === 'tests' ? 'Fee Received' : 'Fee Paid'}</th>
                    <th className="px-6 py-4 text-right">Fee Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-[#fdfafb] transition-colors">
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {formatDate(record.visit_date)}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {tab === 'tests' ? record.test_advised || record.reference : record.reference || 'Consultation'}
                      </td>
                      <td className="px-6 py-4 text-gray-500 hidden lg:table-cell">
                        {record.received_by || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right text-emerald-600 font-medium">
                        {formatCurrency(tab === 'tests' ? record.fee_received : record.fee_paid)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {Number(record.fee_due) > 0 ? (
                          <span className="text-[#b81d3f] font-medium bg-[#fef2f2] px-2.5 py-1 rounded-md">
                            {formatCurrency(record.fee_due)}
                          </span>
                        ) : (
                          <span className="text-gray-400 font-medium">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards View */}
            <div className="md:hidden divide-y divide-gray-100">
              {records.map((record) => (
                <div key={record.id} className="p-4 hover:bg-[#fdfafb] transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {tab === 'tests' ? record.test_advised || record.reference : record.reference || 'Consultation'}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">{formatDate(record.visit_date)}</p>
                    </div>
                    {Number(record.fee_due) > 0 ? (
                      <span className="inline-flex items-center text-xs font-semibold text-[#b81d3f] bg-[#fef2f2] px-2 py-0.5 rounded-md">
                        Due: {formatCurrency(record.fee_due)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Paid
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500 mt-3 pt-3 border-t border-gray-50">
                    <span className="truncate pr-2">By: {record.received_by || 'N/A'}</span>
                    <span className="font-medium whitespace-nowrap">
                      {tab === 'tests' ? 'Rcvd' : 'Paid'}: {formatCurrency(tab === 'tests' ? record.fee_received : record.fee_paid)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <RecordsPagination 
              currentPage={currentPage} 
              totalItems={totalCount} 
              pageSize={PAGE_SIZE} 
            />
          </>
        )}
      </div>
    </div>
  )
}
