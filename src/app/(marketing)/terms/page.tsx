import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Terms & Conditions | Wasfa Diagnostic Centre",
  description: "Terms for using Wasfa Diagnostic Centre website, patient portal, and patient app.",
};

export default function TermsPage() {
  return (
    <main className={styles.legalPage}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>Terms & Conditions</span>
          <h1 className={styles.title}>Clear terms for digital access.</h1>
          <p className={styles.intro}>
            These Terms & Conditions govern use of the Wasfa Diagnostic Centre website, patient portal, and patient mobile application.
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
            <h2>1. Acceptance of terms</h2>
            <p>
              By using our website, patient portal, or mobile application, you agree to these Terms & Conditions. If you do not agree, please do not use the digital service and contact Wasfa Diagnostic Centre for assistance.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Patient portal access</h2>
            <p>
              Portal access is provided to authorized patients or authorized caretakers. You are responsible for keeping your MRN, password, and device access secure. Notify Wasfa Diagnostic Centre if you believe your account has been accessed without permission.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Permitted use</h2>
            <p>You agree to use the service only for lawful and authorized purposes, including:</p>
            <ul>
              <li>Viewing patient profiles you are authorized to access.</li>
              <li>Reviewing diagnostic records and reports.</li>
              <li>Downloading available reports for personal healthcare use.</li>
              <li>Contacting Wasfa Diagnostic Centre for support or correction requests.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Prohibited use</h2>
            <p>You must not attempt to:</p>
            <ul>
              <li>Access another patient&apos;s records without authorization.</li>
              <li>Share login credentials with unauthorized persons.</li>
              <li>Bypass security controls, rate limits, or access restrictions.</li>
              <li>Copy, disrupt, reverse engineer, or misuse the digital systems.</li>
              <li>Upload, transmit, or attempt any harmful code or abusive traffic.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Report availability</h2>
            <p>
              Reports become available after processing and upload by authorized staff. Availability times can vary depending on the type of test, workflow, review, or technical conditions. If a report is missing or appears incorrect, please contact the centre.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Medical information</h2>
            <p>
              Diagnostic reports and records are provided for patient access and continuity of care. They should be interpreted by qualified healthcare professionals. The digital portal does not provide medical advice, diagnosis, or treatment.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Accuracy and corrections</h2>
            <p>
              We aim to keep patient records accurate, but administrative or technical errors may occur. Contact Wasfa Diagnostic Centre if you believe account, patient, billing, or report information requires review.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Service availability</h2>
            <p>
              We work to keep the website, portal, and app available, but access may be interrupted due to maintenance, connectivity, hosting issues, security events, or factors outside our control.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Privacy</h2>
            <p>
              Use of the service is also governed by our Privacy Policy, which explains how patient and technical information is collected, used, stored, and protected.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Changes to terms</h2>
            <p>
              We may update these Terms & Conditions when our services, systems, policies, or legal requirements change. Continued use of the service after updates means you accept the revised terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Contact</h2>
            <p>
              For questions about these terms, contact Wasfa Diagnostic Centre at wasfadiagnostic@yahoo.com, +92 346-7122225, or visit Major Akram Shaheed Road, Azizabad, Jhelum, Punjab, Pakistan.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
