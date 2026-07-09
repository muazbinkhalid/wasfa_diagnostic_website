'use client'

import { useEffect, useId, useState } from 'react'
import { ArrowRight, Mail, Phone, X } from 'lucide-react'
import styles from './SignIn.module.css'

export default function PortalSupportHelp() {
  const [isOpen, setIsOpen] = useState(false)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  return (
    <>
      <section className={styles.supportStrip} aria-label="Login help">
        <div className={styles.supportCopy}>
          <p className={styles.supportEyebrow}>Need help signing in?</p>
          <p className={styles.supportText}>
            If you are having trouble with your MRN, password, or portal access, open our support contact card.
          </p>
        </div>

        <button
          type="button"
          className={styles.helpButton}
          onClick={() => setIsOpen(true)}
        >
          Need help?
        </button>
      </section>

      {isOpen && (
        <div
          className={styles.modalBackdrop}
          onMouseDown={() => setIsOpen(false)}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.modalEyebrow}>Wasfa Diagnostic Centre</p>
                <h2 id={titleId} className={styles.modalTitle}>Login support</h2>
              </div>

              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setIsOpen(false)}
                aria-label="Close support popup"
              >
                <X size={16} aria-hidden="true" />
                <span>Close</span>
              </button>
            </div>

            <p id={descriptionId} className={styles.modalText}>
              For login-related issues, please contact the centre using one of these options.
            </p>

            <div className={styles.modalActions}>
              <a className={styles.modalAction} href="tel:+923467122225">
                <Phone size={16} aria-hidden="true" />
                Call support
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a className={styles.modalActionSecondary} href="mailto:wasfadiagnostic@yahoo.com">
                <Mail size={16} aria-hidden="true" />
                Email support
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>

            <div className={styles.contactGrid}>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Phone</span>
                <a href="tel:+923467122225">+92 346-7122225</a>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Email</span>
                <a href="mailto:wasfadiagnostic@yahoo.com">wasfadiagnostic@yahoo.com</a>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Visit</span>
                <span>Major Akram Shaheed Road, Azizabad, Jhelum, Punjab, Pakistan</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
