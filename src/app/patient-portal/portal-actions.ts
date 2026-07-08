'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function switchActiveProfile(profileId: string) {
  const cookieStore = await cookies()
  cookieStore.set('wasfa_active_profile', profileId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  const cookieStore = await cookies()
  cookieStore.delete('wasfa_active_profile')
  
  redirect('/patient-portal')
}
