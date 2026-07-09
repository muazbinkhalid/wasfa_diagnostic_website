import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PortalSupportHelp from './PortalSupportHelp'
import SignInForm from './SignInForm'
import styles from './SignIn.module.css'

export const metadata: Metadata = {
  title: "Patient Portal",
  description: "Sign in to the Wasfa Diagnostic Centre secure patient portal to access your diagnostic reports and visit history.",
  alternates: {
    canonical: "/patient-portal",
  },
};

export default function SignInPage() {
  return (
    <div className={styles.layout}>
      <main className={styles.editorialContainer}>
        <section className={styles.formSection}>
          <div className={styles.escapeRow}>
            <Link href="/" className={styles.backLink} aria-label="Return to Wasfa home">
              <ArrowLeft size={16} aria-hidden="true" />
              Back to home
            </Link>
          </div>

          <header className={styles.header}>
            <div className={styles.brandKicker}>Wasfa Diagnostic Centre</div>
            <h1 className={styles.title}>Patient Portal</h1>
            <p className={styles.subtitle}>
              Secure access to your diagnostic reports and visit history.
            </p>
          </header>

          <SignInForm />
          <div className={styles.mobileHelpOnly}>
            <PortalSupportHelp />
          </div>

          <p className={styles.returnHint}>
            Not trying to sign in? <Link href="/">Return to Wasfa Diagnostic Centre.</Link>
          </p>
        </section>

        <aside className={styles.brandSection}>
          <div className={styles.urduWatermark} aria-hidden="true">واصفہ</div>

          <div className={styles.brandContent}>
            <div className={styles.decorativeLine}></div>
            <h2 className={styles.brandTitle}>Confidence in Care</h2>

            <div className={styles.infoBlock}>
              <h3 className={styles.infoTitle}>First time signing in?</h3>
              <p className={styles.infoText}>
                Use <strong>wasfa</strong> + the last 4 digits of your registered phone number as your temporary password (e.g., <strong>wasfa1234</strong>).
              </p>
            </div>
            
            <div className={styles.desktopHelpOnly}>
              <PortalSupportHelp />
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
