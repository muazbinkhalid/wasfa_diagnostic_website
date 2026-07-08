'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import crypto from 'crypto'

export type SignInState = {
  error?: string
  success?: boolean
  mrn?: string // Persist MRN on error
}

export async function signInPatient(
  prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  const mrn = formData.get('mrn') as string
  const password = formData.get('password') as string

  if (!mrn || !password) {
    return {
      error: 'Unable to sign in. Check your MRN and password or contact Wasfa Diagnostic Centre.',
      mrn,
    }
  }

  // 1. Exact MRN normalisation
  const normalizedMrn = mrn.trim().replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  if (!normalizedMrn) {
    return {
      error: 'Unable to sign in. Check your MRN and password or contact Wasfa Diagnostic Centre.',
      mrn,
    }
  }

  const supabase = await createClient()

  // 2. Abuse Protection (Login Throttling)
  const headerStore = await headers()
  const ip = headerStore.get('x-forwarded-for') || headerStore.get('x-real-ip') || 'unknown-ip'
  
  // Privacy-safe hash of IP + normalized MRN
  const ipMrnHash = crypto.createHash('sha256').update(`${ip}-${normalizedMrn}`).digest('hex')
  
  // Check rate limit: max 5 attempts in the last 15 minutes
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString()
  
  const { count } = await supabase
    .from('portal_login_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('ip_mrn_hash', ipMrnHash)
    .gte('attempted_at', fifteenMinutesAgo)

  if (count !== null && count >= 5) {
    return {
      error: 'Unable to sign in. Check your MRN and password or contact Wasfa Diagnostic Centre.',
      mrn,
    }
  }

  // 3. Auth identity mapping
  const syntheticEmail = `${normalizedMrn}@patient.wasfa.pk`

  // 4. Authentication (Never trim or transform the password here)
  const { error: authError, data: authData } = await supabase.auth.signInWithPassword({
    email: syntheticEmail,
    password,
  })

  if (authError || !authData.user) {
    // Record failed attempt
    await supabase.from('portal_login_attempts').insert({ ip_mrn_hash: ipMrnHash })

    // DO NOT reveal whether an MRN, account, phone number, or password exists
    return {
      error: 'Unable to sign in. Check your MRN and password or contact Wasfa Diagnostic Centre.',
      mrn,
    }
  }

  // Clear previous failed attempts on success to prevent lockout from legitimate IP rotations
  await supabase.from('portal_login_attempts').delete().eq('ip_mrn_hash', ipMrnHash)

  // 5. Verification and Validation
  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .select('id, portal_enabled, is_active, phone')
    .eq('auth_user_id', authData.user.id)
    .single()

  if (patientError || !patient || !patient.portal_enabled || !patient.is_active) {
    // Validation failed: sign out immediately and return generic error
    await supabase.auth.signOut()
    return {
      error: 'Unable to sign in. Check your MRN and password or contact Wasfa Diagnostic Centre.',
      mrn,
    }
  }

  // 6. Check if it's the first time signing in by matching the temporary password
  let isFirstTime = false
  const digits = (patient.phone ?? '').replace(/\D/g, '')
  if (digits.length >= 4) {
    isFirstTime = password === `wasfa${digits.slice(-4)}`
  } else {
    const candidate = `wasfa${normalizedMrn}`
    const defaultPwd = candidate.length >= 6 ? candidate : `${candidate}123456`.slice(0, 12)
    isFirstTime = password === defaultPwd
  }

  // 7. Redirect appropriate to the state
  if (isFirstTime) {
    redirect('/patient-portal/change-password')
  } else {
    redirect('/patient-portal/dashboard')
  }
}
