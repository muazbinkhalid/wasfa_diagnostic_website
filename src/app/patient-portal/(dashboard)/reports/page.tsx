import { Clock, Download, FileCheck, FileX } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { getSecureActiveProfileId } from '@/utils/profile'
import styles from '@/components/portal/PortalDashboard.module.css'

export const dynamic = 'force-dynamic'

type TestWithReports = {
  id: string
  test_advised: string | null
  reference: string | null
  visit_date: string | null
  reports: { id: string }[] | null
}

type ReadyReport = {
  id: string
  created_at: string | null
  patient_tests: RelatedTest | RelatedTest[] | null
}

type RelatedTest = {
  test_advised: string | null
  reference: string | null
}

function formatDate(dateString: string | null) {
  if (!dateString) return 'Not available'

  return new Date(dateString).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function testName(test: TestWithReports) {
  return test.test_advised || test.reference || 'Lab test'
}

function reportName(report: ReadyReport) {
  const relatedTest = Array.isArray(report.patient_tests)
    ? report.patient_tests[0] ?? null
    : report.patient_tests

  return relatedTest?.test_advised || relatedTest?.reference || 'Diagnostic report'
}

export default async function ReportsPage() {
  const activeProfileId = await getSecureActiveProfileId()

  if (!activeProfileId) return null

  const supabase = await createClient()

  const [testsResult, reportsResult] = await Promise.all([
    supabase
      .from('patient_tests')
      .select('id, test_advised, reference, visit_date, reports(id)')
      .eq('patient_id', activeProfileId)
      .order('visit_date', { ascending: false }),
    supabase
      .from('reports')
      .select('id, created_at, patient_tests(test_advised, reference)')
      .eq('patient_id', activeProfileId)
      .order('created_at', { ascending: false }),
  ])

  const allTests = (testsResult.data ?? []) as TestWithReports[]
  const readyReports = (reportsResult.data ?? []) as ReadyReport[]
  const pendingReports = allTests.filter((test) => !test.reports || test.reports.length === 0)

  return (
    <div className={`${styles.page} ${styles.stack}`}>
      <section className={styles.reportsGrid} aria-label="Report metrics">
        <article className={styles.metricCard}>
          <span className={`${styles.metricIcon} ${styles.metricIconAmber}`}>
            <Clock size={20} />
          </span>
          <div className={styles.metricBody}>
            <div className={styles.metricValue}>{pendingReports.length}</div>
            <div className={styles.metricLabel}>Pending reports</div>
            <div className={styles.metricHint}>Tests waiting for final files</div>
          </div>
        </article>

        <article className={styles.metricCard}>
          <span className={`${styles.metricIcon} ${styles.metricIconGreen}`}>
            <FileCheck size={20} />
          </span>
          <div className={styles.metricBody}>
            <div className={styles.metricValue}>{readyReports.length}</div>
            <div className={styles.metricLabel}>Available reports</div>
            <div className={styles.metricHint}>Ready to download securely</div>
          </div>
        </article>
      </section>

      <section className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleWrap}>
            <span className={styles.sectionIcon}>
              <FileCheck size={18} />
            </span>
            <div>
              <h2 className={styles.sectionTitle}>Ready reports</h2>
              <p className={styles.sectionSubtitle}>Finalized PDFs available for this patient profile</p>
            </div>
          </div>
        </div>

        {readyReports.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>
              <FileX size={22} />
            </span>
            <div className={styles.emptyTitle}>No ready reports</div>
            <p className={styles.emptyText}>When lab results are finalized, secure downloads will appear here.</p>
          </div>
        ) : (
          <>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Report</th>
                    <th>Uploaded</th>
                    <th>Status</th>
                    <th className={styles.rightCell}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {readyReports.map((report) => (
                    <tr key={report.id}>
                      <td className={styles.strongCell}>{reportName(report)}</td>
                      <td>{formatDate(report.created_at)}</td>
                      <td>
                        <span className={styles.paidPill}>Ready</span>
                      </td>
                      <td className={styles.rightCell}>
                        <a
                          href={`/api/patient-portal/reports/download?id=${report.id}`}
                          className={styles.primaryButton}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download size={16} />
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.mobileList}>
              {readyReports.map((report) => (
                <article className={styles.mobileCard} key={report.id}>
                  <div className={styles.mobileCardTop}>
                    <div>
                      <div className={styles.itemTitle}>{reportName(report)}</div>
                      <div className={styles.itemMeta}>{formatDate(report.created_at)}</div>
                    </div>
                    <span className={styles.paidPill}>Ready</span>
                  </div>
                  <div className={styles.mobileMetaRow}>
                    <span>Secure PDF</span>
                    <a
                      href={`/api/patient-portal/reports/download?id=${report.id}`}
                      className={styles.button}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download size={16} />
                      Download
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <section className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleWrap}>
            <span className={styles.sectionIcon}>
              <Clock size={18} />
            </span>
            <div>
              <h2 className={styles.sectionTitle}>Pending reports</h2>
              <p className={styles.sectionSubtitle}>Tests recorded but not yet uploaded as report files</p>
            </div>
          </div>
        </div>

        {pendingReports.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>
              <FileCheck size={22} />
            </span>
            <div className={styles.emptyTitle}>All caught up</div>
            <p className={styles.emptyText}>There are no tests waiting for reports right now.</p>
          </div>
        ) : (
          <div className={styles.reportList}>
            {pendingReports.map((test) => (
              <div className={styles.reportItem} key={test.id}>
                <div className={styles.reportMain}>
                  <div className={styles.itemTitle}>{testName(test)}</div>
                  <div className={styles.itemMeta}>Visit date: {formatDate(test.visit_date)}</div>
                </div>
                <span className={styles.processingPill}>Processing</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
