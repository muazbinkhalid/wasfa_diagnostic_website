import Image from 'next/image'
import Link from 'next/link'
import SignInForm from './SignInForm'
import styles from './SignIn.module.css'

export default function SignInPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Image
            src="/logo.png"
            alt="Wasfa Diagnostic Centre"
            width={160}
            height={60}
            className={styles.logo}
            priority
          />
          <h1 className={styles.title}>Patient Portal</h1>
          <p className={styles.subtitle}>
            Access your diagnostic reports and visit information.
          </p>
        </div>
        
        <SignInForm />
        
        <p className={styles.helpText}>
          First time signing in? Use the temporary password provided by Wasfa Diagnostic Centre.
        </p>

        <div className={styles.footer}>
          <Link href="/" className={styles.backLink}>
            &larr; Back to website
          </Link>
        </div>
      </div>
    </div>
  )
}
