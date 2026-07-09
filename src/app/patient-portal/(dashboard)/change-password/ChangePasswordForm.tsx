'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import styles from '@/components/portal/PortalDashboard.module.css'

type PasswordRule = {
  label: string
  isValid: boolean
}

export default function ChangePasswordForm() {
  const supabase = createClient()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const passwordRules: PasswordRule[] = [
    { label: 'At least 8 characters', isValid: newPassword.length >= 8 },
    { label: 'Includes a letter', isValid: /[A-Za-z]/.test(newPassword) },
    { label: 'Includes a number', isValid: /\d/.test(newPassword) },
    { label: 'Confirmation matches', isValid: newPassword.length > 0 && newPassword === confirmPassword },
  ]

  const isPasswordValid = passwordRules.every((rule) => rule.isValid)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(false)

    if (!currentPassword) {
      setError('Enter your current password before setting a new one.')
      return
    }

    if (!isPasswordValid) {
      setError('Please meet all password requirements before continuing.')
      return
    }

    if (currentPassword === newPassword) {
      setError('Choose a new password that is different from your current password.')
      return
    }

    setLoading(true)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    const email = user?.email

    if (userError || !email) {
      setError('We could not confirm your session. Please sign in again and try updating your password.')
      setLoading(false)
      return
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    })

    if (verifyError) {
      setError('Current password is incorrect.')
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      setError(updateError.message || 'Failed to update password.')
    } else {
      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {error && (
        <div className={styles.alertError} role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      {success && (
        <div className={styles.alertSuccess} role="status" aria-live="polite">
          Password successfully updated.
        </div>
      )}

      <div className={styles.fieldGroup}>
        <label htmlFor="current-password" className={styles.label}>
          Current password
        </label>
        <input
          id="current-password"
          name="current-password"
          type="password"
          required
          autoComplete="current-password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="new-password" className={styles.label}>
          New password
        </label>
        <input
          id="new-password"
          name="new-password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="confirm-password" className={styles.label}>
          Confirm new password
        </label>
        <input
          id="confirm-password"
          name="confirm-password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className={styles.input}
        />
      </div>

      <ul className={styles.passwordRules} aria-label="Password requirements">
        {passwordRules.map((rule) => (
          <li
            key={rule.label}
            className={rule.isValid ? styles.passwordRuleValid : styles.passwordRule}
          >
            <span aria-hidden="true">{rule.isValid ? 'OK' : '-'}</span>
            {rule.label}
          </li>
        ))}
      </ul>

      <button type="submit" disabled={loading} className={styles.primaryButton}>
        {loading ? 'Updating...' : 'Update password'}
      </button>
    </form>
  )
}
