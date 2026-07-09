import { LogOut, ShieldCheck, UserRound } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { signOut } from '@/app/patient-portal/portal-actions'
import { getSecureActiveProfileId } from '@/utils/profile'
import ChangePasswordForm from '../change-password/ChangePasswordForm'
import styles from '@/components/portal/PortalDashboard.module.css'

export const dynamic = 'force-dynamic'

type Patient = {
  full_name: string
  mrn: string
  age: number | null
  date_of_birth: string | null
  gender: string | null
  phone: string | null
  cnic: string | null
  email: string | null
  father_husband_name: string | null
  address: string | null
}

function formatDate(dateString: string | null) {
  if (!dateString) return 'Not available'

  return new Date(dateString).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatValue(value: string | number | null) {
  if (value === null || value === '') return 'Not available'
  return String(value)
}

export default async function ProfilePage() {
  const activeProfileId = await getSecureActiveProfileId()

  if (!activeProfileId) return null

  const supabase = await createClient()
  const { data } = await supabase
    .from('patients')
    .select('full_name, mrn, age, date_of_birth, gender, phone, cnic, email, father_husband_name, address')
    .eq('id', activeProfileId)
    .single()

  const patient = data as Patient | null

  if (!patient) return null

  return (
    <div className={`${styles.page} ${styles.stack}`}>
      <section className={styles.profileGrid}>
        <div className={styles.panel}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrap}>
              <span className={styles.sectionIcon}>
                <UserRound size={18} />
              </span>
              <div>
                <h2 className={styles.sectionTitle}>Patient profile</h2>
                <p className={styles.sectionSubtitle}>Details connected to the selected profile</p>
              </div>
            </div>
          </div>

          <div className={styles.profileRows}>
            <div className={styles.profileRow}>
              <span className={styles.label}>Full name</span>
              <span className={styles.value}>{patient.full_name}</span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.label}>MRN</span>
              <span className={styles.value}>{patient.mrn}</span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.label}>Father / husband name</span>
              <span className={styles.value}>{formatValue(patient.father_husband_name)}</span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.label}>Date of birth</span>
              <span className={styles.value}>{formatDate(patient.date_of_birth)}</span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.label}>Age</span>
              <span className={styles.value}>{formatValue(patient.age)}</span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.label}>Gender</span>
              <span className={styles.value}>{formatValue(patient.gender)}</span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.label}>Phone</span>
              <span className={styles.value}>{formatValue(patient.phone)}</span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{formatValue(patient.email)}</span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.label}>CNIC</span>
              <span className={styles.value}>{formatValue(patient.cnic)}</span>
            </div>
            <div className={styles.profileRow}>
              <span className={styles.label}>Address</span>
              <span className={styles.value}>{formatValue(patient.address)}</span>
            </div>
          </div>
        </div>

        <div className={styles.stack}>
          <div className={styles.panel}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleWrap}>
                <span className={styles.sectionIcon}>
                  <ShieldCheck size={18} />
                </span>
                <div>
                  <h2 className={styles.sectionTitle}>Security</h2>
                  <p className={styles.sectionSubtitle}>Update your portal password</p>
                </div>
              </div>
            </div>

            <ChangePasswordForm />
          </div>

          <div className={styles.panel}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleWrap}>
                <span className={styles.sectionIcon}>
                  <LogOut size={18} />
                </span>
                <div>
                  <h2 className={styles.sectionTitle}>Session</h2>
                  <p className={styles.sectionSubtitle}>Sign out from this browser</p>
                </div>
              </div>
            </div>

            <form action={signOut}>
              <button type="submit" className={styles.dangerButton}>
                <LogOut size={16} />
                Logout
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
