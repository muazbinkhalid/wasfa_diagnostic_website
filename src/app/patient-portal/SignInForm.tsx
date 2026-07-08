'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { signInPatient, type SignInState } from './actions'
import styles from './SignIn.module.css'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={styles.submitButton}
      aria-live="polite"
    >
      {pending ? 'Signing In...' : 'Sign In'}
    </button>
  )
}

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const initialState: SignInState = { error: undefined, mrn: '' }
  const [state, formAction] = useActionState(signInPatient, initialState)

  return (
    <form action={formAction} noValidate>
      {state?.error && (
        <div className={styles.errorAlert} role="alert" aria-live="assertive">
          {state.error}
        </div>
      )}
      
      <div className={styles.formGroup}>
        <label htmlFor="mrn" className={styles.label}>
          Medical Record Number (MRN)
        </label>
        <input
          id="mrn"
          name="mrn"
          type="text"
          required
          maxLength={50}
          autoComplete="username"
          defaultValue={state?.mrn || ''}
          className={`${styles.input} ${state?.error ? styles.inputError : ''}`}
          placeholder="e.g. AA-XXXXXX"
          aria-invalid={!!state?.error}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <div className={styles.passwordWrapper}>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            maxLength={128}
            autoComplete="current-password"
            className={`${styles.input} ${styles.passwordInput} ${state?.error ? styles.inputError : ''}`}
            aria-invalid={!!state?.error}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.togglePassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <SubmitButton />
    </form>
  )
}
