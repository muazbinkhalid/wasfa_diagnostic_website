import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | Wasfa Diagnostic Centre",
  description: "Privacy practices for Wasfa Diagnostic Centre website, patient portal, and patient app.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.legalPage}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>Privacy Policy</span>
          <h1 className={styles.title}>Your health data deserves careful handling.</h1>
          <p className={styles.intro}>
            This Privacy Policy explains how Wasfa Diagnostic Centre collects, uses, stores, and protects information through its website, patient portal, and patient mobile application.
          </p>
          <span className={styles.meta}>Effective date: July 9, 2026</span>
          <br />
          <Link href="/" className={styles.homeLink}>
            Back to home
            <ArrowLeft size={16} aria-hidden="true" className={styles.homeLinkIcon} />
          </Link>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>1. Who we are</h2>
            <p>
              Wasfa Diagnostic Centre provides diagnostic imaging, laboratory, report access, and related patient support services from Jhelum, Punjab, Pakistan.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Information we collect</h2>
            <p>Depending on how you use our services, we may collect:</p>
            <ul>
              <li>Identity and contact details such as name, MRN, phone number, age, gender, address, CNIC where applicable, and email.</li>
              <li>Patient record information such as tests advised, checkups, fee received, fee due, visit dates, references, and received-by details.</li>
              <li>Diagnostic report metadata and report files made available through the patient portal or app.</li>
              <li>Authentication data required to sign in, maintain secure sessions, and protect accounts.</li>
              <li>Technical data such as device/browser type, IP-derived security signals, and basic logs needed for security, abuse prevention, and troubleshooting.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. How we use information</h2>
            <p>We use information to:</p>
            <ul>
              <li>Provide diagnostic services, patient records, and report downloads.</li>
              <li>Authenticate patient portal or app users and keep accounts secure.</li>
              <li>Communicate with patients about reports, support, or service-related needs.</li>
              <li>Maintain accurate clinical, administrative, billing, and operational records.</li>
              <li>Detect abuse, protect patient information, and improve service reliability.</li>
              <li>Meet legal, regulatory, medical, accounting, and audit obligations.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Report access and storage</h2>
            <p>
              Diagnostic report files are stored securely and made available only to authorized users linked to the relevant patient record. Report downloads may use short-lived secure links so files can be accessed without exposing permanent public URLs.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Sharing of information</h2>
            <p>
              We do not sell patient information. We may share information only when needed to provide care, operate our systems, comply with law, support authorized staff workflows, or work with trusted service providers who help host, secure, or maintain our digital services.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Security</h2>
            <p>
              We use authentication, access controls, secure storage practices, and role-based restrictions to reduce unauthorized access. No digital system is completely risk-free, but we work to protect patient information with reasonable technical and organizational safeguards.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Data retention</h2>
            <p>
              We retain patient and diagnostic information for as long as needed for medical, legal, regulatory, audit, billing, and operational purposes. Retention periods may vary depending on the type of record and applicable requirements.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Your choices and requests</h2>
            <p>
              You may contact Wasfa Diagnostic Centre to request help with account access, correction of inaccurate administrative details, report access issues, or data-related questions. Some medical and billing records may need to be retained where required by law or clinical recordkeeping standards.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Children and family accounts</h2>
            <p>
              A patient account may be used by a parent, guardian, caretaker, or family account holder to access records for authorized patient profiles. Users are responsible for keeping login credentials confidential and using access only for patients they are authorized to manage.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Medical disclaimer</h2>
            <p>
              Digital report access is provided for convenience and record review. It is not a replacement for consultation with a qualified healthcare professional. Patients should discuss diagnostic results with their doctor or healthcare provider.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Contact</h2>
            <p>
              For privacy questions or support, contact Wasfa Diagnostic Centre at wasfadiagnostic@yahoo.com, +92 346-7122225, or visit Major Akram Shaheed Road, Azizabad, Jhelum, Punjab, Pakistan.
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Updates</h2>
            <p>
              We may update this Privacy Policy when our services, systems, or legal requirements change. The latest version will be available on this page.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
