import { ClipboardList } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import RecordsFilterBar from '@/components/portal/RecordsFilterBar'
import RecordsPagination from '@/components/portal/RecordsPagination'
import { getSecureActiveProfileId } from '@/utils/profile'
import styles from '@/components/portal/PortalDashboard.module.css'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 10

type RecordTab = 'tests' | 'checkups'

type TestRecord = {
  id: string
  test_advised: string | null
  visit_date: string | null
  reference: string | null
  received_by: string | null
  fee_received: number | string | null
  fee_due: number | string | null
}

type CheckupRecord = {
  id: string
  visit_date: string | null
  reference: string | null
  received_by: string | null
  fee_paid: number | string | null
  fee_due: number | string | null
}

type DisplayRecord = {
  id: string
  title: string
  visitDate: string | null
  receivedBy: string
  paidAmount: number
  dueAmount: number
  paidLabel: string
}

function toNumber(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatCurrency(amount: number) {
  return `Rs ${amount.toLocaleString('en-PK')}`
}

function formatDate(dateString: string | null) {
  if (!dateString) return 'Not available'

  return new Date(dateString).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function normalizeSearchTerm(term: string) {
  return term.replace(/[(),]/g, ' ').trim()
}

function getMonthRange(month: string) {
  const [year, monthNumber] = month.split('-')
  const numericMonth = Number(monthNumber)
  const nextMonth = numericMonth === 12 ? '01' : String(numericMonth + 1).padStart(2, '0')
  const nextYear = numericMonth === 12 ? String(Number(year) + 1) : year

  return {
    startDate: `${year}-${monthNumber}-01T00:00:00Z`,
    endDate: `${nextYear}-${nextMonth}-01T00:00:00Z`,
  }
}

export default async function RecordsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const activeProfileId = await getSecureActiveProfileId()

  if (!activeProfileId) return null

  const tab: RecordTab = searchParams.tab === 'checkups' ? 'checkups' : 'tests'
  const queryText = typeof searchParams.q === 'string' ? normalizeSearchTerm(searchParams.q) : ''
  const month = typeof searchParams.month === 'string' ? searchParams.month : ''
  const pageParam = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1
  const currentPage = !Number.isNaN(pageParam) && pageParam > 0 ? pageParam : 1

  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  let records: DisplayRecord[] = []
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
      const { startDate, endDate } = getMonthRange(month)
      query = query.gte('visit_date', startDate).lt('visit_date', endDate)
    }

    const { data, count } = await query
    const testRecords = (data ?? []) as TestRecord[]

    records = testRecords.map((record) => ({
      id: record.id,
      title: record.test_advised || record.reference || 'Lab test',
      visitDate: record.visit_date,
      receivedBy: record.received_by || 'Not available',
      paidAmount: toNumber(record.fee_received),
      dueAmount: toNumber(record.fee_due),
      paidLabel: 'Fee received',
    }))
    totalCount = count || 0
  } else {
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
      const { startDate, endDate } = getMonthRange(month)
      query = query.gte('visit_date', startDate).lt('visit_date', endDate)
    }

    const { data, count } = await query
    const checkupRecords = (data ?? []) as CheckupRecord[]

    records = checkupRecords.map((record) => ({
      id: record.id,
      title: record.reference || 'Clinical checkup',
      visitDate: record.visit_date,
      receivedBy: record.received_by || 'Not available',
      paidAmount: toNumber(record.fee_paid),
      dueAmount: toNumber(record.fee_due),
      paidLabel: 'Fee paid',
    }))
    totalCount = count || 0
  }

  return (
    <div className={`${styles.page} ${styles.stack}`}>
      <RecordsFilterBar />

      <section className={styles.recordShell}>
        {records.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>
              <ClipboardList size={22} />
            </span>
            <div className={styles.emptyTitle}>No records found</div>
            <p className={styles.emptyText}>
              {queryText || month
                ? 'Try adjusting your search or date filter.'
                : `No ${tab === 'tests' ? 'test' : 'checkup'} records are available for this patient profile.`}
            </p>
          </div>
        ) : (
          <>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>{tab === 'tests' ? 'Test advised' : 'Checkup reference'}</th>
                    <th>Received by</th>
                    <th className={styles.rightCell}>{tab === 'tests' ? 'Fee received' : 'Fee paid'}</th>
                    <th className={styles.rightCell}>Fee due</th>
                    <th className={styles.rightCell}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td className={styles.strongCell}>{formatDate(record.visitDate)}</td>
                      <td className={styles.strongCell}>{record.title}</td>
                      <td>{record.receivedBy}</td>
                      <td className={styles.rightCell}>{formatCurrency(record.paidAmount)}</td>
                      <td className={styles.rightCell}>{formatCurrency(record.dueAmount)}</td>
                      <td className={styles.rightCell}>
                        <span className={record.dueAmount > 0 ? styles.duePill : styles.paidPill}>
                          {record.dueAmount > 0 ? 'Due' : 'Paid'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.mobileList}>
              {records.map((record) => (
                <article className={styles.mobileCard} key={record.id}>
                  <div className={styles.mobileCardTop}>
                    <div>
                      <div className={styles.itemTitle}>{record.title}</div>
                      <div className={styles.itemMeta}>{formatDate(record.visitDate)}</div>
                    </div>
                    <span className={record.dueAmount > 0 ? styles.duePill : styles.paidPill}>
                      Due {formatCurrency(record.dueAmount)}
                    </span>
                  </div>
                  <div className={styles.mobileMetaRow}>
                    <span>By: {record.receivedBy}</span>
                    <span>{record.paidLabel}: {formatCurrency(record.paidAmount)}</span>
                  </div>
                </article>
              ))}
            </div>

            <RecordsPagination
              currentPage={currentPage}
              totalItems={totalCount}
              pageSize={PAGE_SIZE}
            />
          </>
        )}
      </section>
    </div>
  )
}
