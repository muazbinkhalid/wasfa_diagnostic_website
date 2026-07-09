'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import styles from '@/components/portal/PortalDashboard.module.css'

export default function ChangePasswordForm() {
  const supabase = createClient()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
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
        <label htmlFor="new-password" className={styles.label}>
          New password
        </label>
        <input
          id="new-password"
          name="new-password"
          type="password"
          required
          minLength={6}
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
          minLength={6}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className={styles.input}
        />
      </div>

      <button type="submit" disabled={loading} className={styles.primaryButton}>
        {loading ? 'Updating...' : 'Update password'}
      </button>
    </form>
  )
}
