import { ShieldCheck } from 'lucide-react'
import ChangePasswordForm from './ChangePasswordForm'
import styles from '@/components/portal/PortalDashboard.module.css'

export const dynamic = 'force-dynamic'

export default function ChangePasswordPage() {
  return (
    <div className={`${styles.narrowPage} ${styles.stack}`}>
      <section className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleWrap}>
            <span className={styles.sectionIcon}>
              <ShieldCheck size={18} />
            </span>
            <div>
              <h1 className={styles.sectionTitle}>Change password</h1>
              <p className={styles.sectionSubtitle}>Set a secure password for your patient portal account</p>
            </div>
          </div>
        </div>

        <ChangePasswordForm />
      </section>
    </div>
  )
}
