import Link from 'next/link'
import SignInForm from './SignInForm'
import styles from './SignIn.module.css'

export default function SignInPage() {
  return (
    <div className={styles.layout}>
      <main className={styles.editorialContainer}>
        
        {/* Left Pane: Interaction / Form */}
        <section className={styles.formSection}>
          <Link href="/" className={styles.backLink} aria-label="Return to Wasfa website">
            &larr; Back to website
          </Link>

          <header className={styles.header}>
            <div className={styles.brandKicker}>Wasfa Diagnostic Centre</div>
            <h1 className={styles.title}>Patient Portal</h1>
            <p className={styles.subtitle}>
              Secure access to your diagnostic reports and visit history.
            </p>
          </header>
          
          <SignInForm />
        </section>

        {/* Right Pane: Brand & Guidance */}
        <aside className={styles.brandSection}>
          <div className={styles.urduWatermark} aria-hidden="true">وصفہ</div>
          
          <div className={styles.brandContent}>
            <div className={styles.decorativeLine}></div>
            <h2 className={styles.brandTitle}>Confidence in Care</h2>
            
            <div className={styles.infoBlock}>
              <h3 className={styles.infoTitle}>First time signing in?</h3>
              <p className={styles.infoText}>
                Use the temporary password provided by Wasfa Diagnostic Centre.
              </p>
            </div>

            <div className={styles.infoBlock}>
              <h3 className={styles.infoTitle}>Need assistance?</h3>
              <p className={styles.infoText}>
                If you are unable to sign in, please contact Wasfa Diagnostic Centre for support.
              </p>
            </div>
          </div>
        </aside>

      </main>
    </div>
  )
}
