import {
  Activity,
  ClipboardList,
  Clock,
  FileCheck,
  FlaskConical,
  HeartPulse,
  WalletCards,
} from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { getSecureActiveProfileId } from '@/utils/profile'
import styles from '@/components/portal/PortalDashboard.module.css'

export const dynamic = 'force-dynamic'

type Patient = {
  id: string
  full_name: string
  mrn: string
  age: number | null
  date_of_birth: string | null
  gender: string | null
  phone: string | null
  father_husband_name: string | null
}

type PatientTest = {
  id: string
  test_advised: string | null
  reference: string | null
  visit_date: string | null
  fee_received: number | string | null
  fee_due: number | string | null
  reports?: { id: string }[] | null
}

type PatientCheckup = {
  id: string
  reference: string | null
  visit_date: string | null
  fee_paid: number | string | null
  fee_due: number | string | null
}

type Report = {
  id: string
  created_at: string | null
  patient_tests: RelatedTest | RelatedTest[] | null
}

type ActivityItem = {
  id: string
  title: string
  meta: string
  dateValue: number
  status: string
}

type RelatedTest = {
  test_advised: string | null
  reference: string | null
}

function firstRelatedTest(value: RelatedTest | RelatedTest[] | null) {
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

function toNumber(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatCurrency(amount: number) {
  return `Rs ${amount.toLocaleString('en-PK')}`
}

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return 'Not available'

  return new Date(dateString).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function calculateAge(patient: Patient) {
  if (patient.age) return `${patient.age} years`
  if (!patient.date_of_birth) return 'Not available'

  const birthDate = new Date(patient.date_of_birth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDelta = today.getMonth() - birthDate.getMonth()

  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1
  }

  return age >= 0 ? `${age} years` : 'Not available'
}

function reportName(report: Report) {
  const relatedTest = firstRelatedTest(report.patient_tests)
  return relatedTest?.test_advised || relatedTest?.reference || 'Diagnostic report'
}

export default async function DashboardOverviewPage() {
  const activeProfileId = await getSecureActiveProfileId()

  if (!activeProfileId) return null

  const supabase = await createClient()

  const [
    patientResult,
    testsResult,
    checkupsResult,
    reportsResult,
  ] = await Promise.all([
    supabase
      .from('patients')
      .select('id, full_name, mrn, age, date_of_birth, gender, phone, father_husband_name')
      .eq('id', activeProfileId)
      .single(),
    supabase
      .from('patient_tests')
      .select('id, test_advised, reference, visit_date, fee_received, fee_due, reports(id)')
      .eq('patient_id', activeProfileId)
      .order('visit_date', { ascending: false }),
    supabase
      .from('patient_checkups')
      .select('id, reference, visit_date, fee_paid, fee_due')
      .eq('patient_id', activeProfileId)
      .order('visit_date', { ascending: false }),
    supabase
      .from('reports')
      .select('id, created_at, patient_tests(test_advised, reference)')
      .eq('patient_id', activeProfileId)
      .order('created_at', { ascending: false }),
  ])

  const patient = patientResult.data as Patient | null
  const tests = (testsResult.data ?? []) as PatientTest[]
  const checkups = (checkupsResult.data ?? []) as PatientCheckup[]
  const reports = (reportsResult.data ?? []) as Report[]

  if (!patient) return null

  const pendingReports = tests.filter((test) => !test.reports || test.reports.length === 0)
  const dueAmount = tests.reduce((sum, test) => sum + toNumber(test.fee_due), 0)
    + checkups.reduce((sum, checkup) => sum + toNumber(checkup.fee_due), 0)

  const latestTest = tests[0]
  const latestCheckup = checkups[0]
  const latestReport = reports[0]

  const recentActivity: ActivityItem[] = [
    ...tests.slice(0, 4).map((test) => ({
      id: `test-${test.id}`,
      title: test.test_advised || test.reference || 'Lab test',
      meta: `Test requested on ${formatDate(test.visit_date)}`,
      dateValue: test.visit_date ? new Date(test.visit_date).getTime() : 0,
      status: test.reports && test.reports.length > 0 ? 'Ready' : 'Pending',
    })),
    ...checkups.slice(0, 4).map((checkup) => ({
      id: `checkup-${checkup.id}`,
      title: checkup.reference ? `Referred by: ${checkup.reference}` : 'Clinical checkup',
      meta: `Checkup visit on ${formatDate(checkup.visit_date)}`,
      dateValue: checkup.visit_date ? new Date(checkup.visit_date).getTime() : 0,
      status: toNumber(checkup.fee_due) > 0 ? 'Due' : 'Paid',
    })),
    ...reports.slice(0, 4).map((report) => ({
      id: `report-${report.id}`,
      title: reportName(report),
      meta: `Report uploaded on ${formatDate(report.created_at)}`,
      dateValue: report.created_at ? new Date(report.created_at).getTime() : 0,
      status: 'Ready',
    })),
  ].sort((a, b) => b.dateValue - a.dateValue).slice(0, 6)

  return (
    <div className={`${styles.page} ${styles.stack}`}>
      <section className={styles.overviewHero}>
        <div className={styles.heroPanel}>
          <span className={styles.eyebrow}>Active patient profile</span>
          <h2 className={styles.heroTitle}>{patient.full_name}</h2>
          <p className={styles.heroMeta}>
            A focused view of this patient&apos;s latest diagnostics, reports, and billing status.
          </p>

          <div className={styles.heroHighlights} aria-label="Patient portal highlights">
            <div className={styles.heroHighlight}>
              <span className={styles.highlightValue}>{reports.length}</span>
              <span className={styles.highlightLabel}>Ready reports</span>
            </div>
            <div className={styles.heroHighlight}>
              <span className={styles.highlightValue}>{pendingReports.length}</span>
              <span className={styles.highlightLabel}>In progress</span>
            </div>
            <div className={styles.heroHighlight}>
              <span className={styles.highlightValue}>{formatCurrency(dueAmount)}</span>
              <span className={styles.highlightLabel}>Balance due</span>
            </div>
          </div>

          <div className={styles.identityGrid}>
            <div className={styles.identityItem}>
              <span className={styles.label}>MRN</span>
              <span className={styles.value}>{patient.mrn}</span>
            </div>
            <div className={styles.identityItem}>
              <span className={styles.label}>Age</span>
              <span className={styles.value}>{calculateAge(patient)}</span>
            </div>
            <div className={styles.identityItem}>
              <span className={styles.label}>Gender</span>
              <span className={styles.value}>{patient.gender || 'Not available'}</span>
            </div>
            <div className={styles.identityItem}>
              <span className={styles.label}>Phone</span>
              <span className={styles.value}>{patient.phone || 'Not available'}</span>
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.sectionTitleWrap}>
              <span className={styles.sectionIcon}>
                <HeartPulse size={18} />
              </span>
              <div>
                <h3 className={styles.sectionTitle}>Latest snapshot</h3>
                <p className={styles.sectionSubtitle}>Most recent clinical movement</p>
              </div>
            </div>
          </div>

          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <div className={styles.activityMain}>
                <div className={styles.itemTitle}>{latestTest?.test_advised || latestTest?.reference || 'No tests yet'}</div>
                <div className={styles.itemMeta}>Latest test: {formatDate(latestTest?.visit_date)}</div>
              </div>
              <span className={styles.statusPill}>Test</span>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityMain}>
                <div className={styles.itemTitle}>
                  {latestCheckup?.reference ? `Referred by: ${latestCheckup.reference}` : 'No checkups yet'}
                </div>
                <div className={styles.itemMeta}>Latest checkup: {formatDate(latestCheckup?.visit_date)}</div>
              </div>
              <span className={styles.statusPill}>Checkup</span>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityMain}>
                <div className={styles.itemTitle}>{latestReport ? reportName(latestReport) : 'No reports ready'}</div>
                <div className={styles.itemMeta}>Latest report: {formatDate(latestReport?.created_at)}</div>
              </div>
              <span className={latestReport ? styles.paidPill : styles.processingPill}>
                {latestReport ? 'Ready' : 'Waiting'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.metricsGrid} aria-label="Dashboard metrics">
        <article className={styles.metricCard}>
          <span className={`${styles.metricIcon} ${styles.metricIconCherry}`}>
            <FlaskConical size={20} />
          </span>
          <div className={styles.metricBody}>
            <div className={styles.metricValue}>{tests.length}</div>
            <div className={styles.metricLabel}>Total tests</div>
            <div className={styles.metricHint}>Requested lab investigations</div>
          </div>
        </article>

        <article className={styles.metricCard}>
          <span className={`${styles.metricIcon} ${styles.metricIconRose}`}>
            <ClipboardList size={20} />
          </span>
          <div className={styles.metricBody}>
            <div className={styles.metricValue}>{checkups.length}</div>
            <div className={styles.metricLabel}>Checkups</div>
            <div className={styles.metricHint}>Clinical visit records</div>
          </div>
        </article>

        <article className={styles.metricCard}>
          <span className={`${styles.metricIcon} ${styles.metricIconAmber}`}>
            <Clock size={20} />
          </span>
          <div className={styles.metricBody}>
            <div className={styles.metricValue}>{pendingReports.length}</div>
            <div className={styles.metricLabel}>Pending reports</div>
            <div className={styles.metricHint}>Tests still processing</div>
          </div>
        </article>

        <article className={styles.metricCard}>
          <span className={`${styles.metricIcon} ${styles.metricIconGreen}`}>
            <WalletCards size={20} />
          </span>
          <div className={styles.metricBody}>
            <div className={styles.metricValue}>{formatCurrency(dueAmount)}</div>
            <div className={styles.metricLabel}>Amount due</div>
            <div className={styles.metricHint}>{reports.length} ready reports available</div>
          </div>
        </article>
      </section>

      <section className={styles.twoColumn}>
        <div className={styles.panel}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrap}>
              <span className={styles.sectionIcon}>
                <Activity size={18} />
              </span>
              <div>
                <h3 className={styles.sectionTitle}>Recent activity</h3>
                <p className={styles.sectionSubtitle}>Latest tests, checkups, and reports</p>
              </div>
            </div>
          </div>

          {recentActivity.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>
                <Activity size={20} />
              </span>
              <div className={styles.emptyTitle}>No activity yet</div>
              <p className={styles.emptyText}>New tests, checkups, and uploaded reports will appear here.</p>
            </div>
          ) : (
            <div className={styles.activityList}>
              {recentActivity.map((item) => (
                <div className={styles.activityItem} key={item.id}>
                  <div className={styles.activityMain}>
                    <div className={styles.itemTitle}>{item.title}</div>
                    <div className={styles.itemMeta}>{item.meta}</div>
                  </div>
                  <span className={styles.statusPill}>{item.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.panel}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrap}>
              <span className={styles.sectionIcon}>
                <FileCheck size={18} />
              </span>
              <div>
                <h3 className={styles.sectionTitle}>Latest ready reports</h3>
                <p className={styles.sectionSubtitle}>Freshly uploaded diagnostic PDFs</p>
              </div>
            </div>
          </div>

          {reports.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>
                <FileCheck size={20} />
              </span>
              <div className={styles.emptyTitle}>No reports available</div>
              <p className={styles.emptyText}>Finalized reports will be listed here once uploaded by the lab team.</p>
            </div>
          ) : (
            <div className={styles.reportList}>
              {reports.slice(0, 4).map((report) => (
                <div className={styles.reportItem} key={report.id}>
                  <div className={styles.reportMain}>
                    <div className={styles.itemTitle}>{reportName(report)}</div>
                    <div className={styles.itemMeta}>{formatDate(report.created_at)}</div>
                  </div>
                  <span className={styles.paidPill}>Ready</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
