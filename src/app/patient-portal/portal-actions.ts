'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function switchActiveProfile(profileId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/patient-portal')
  }

  const { data: profile } = await supabase
    .from('patients')
    .select('id')
    .eq('id', profileId)
    .eq('auth_user_id', user.id)
    .eq('portal_enabled', true)
    .eq('is_active', true)
    .single()

  if (!profile) {
    return
  }

  const cookieStore = await cookies()
  cookieStore.set('wasfa_active_profile', profileId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  const cookieStore = await cookies()
  cookieStore.delete('wasfa_active_profile')
  
  redirect('/patient-portal')
}
