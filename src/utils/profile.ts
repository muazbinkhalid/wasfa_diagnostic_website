import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function getSecureActiveProfileId() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return null
  }

  const { data: validProfiles } = await supabase
    .from('patients')
    .select('id')
    .eq('auth_user_id', user.id)

  if (!validProfiles || validProfiles.length === 0) {
    return null
  }

  const cookieStore = await cookies()
  const activeProfileCookie = cookieStore.get('wasfa_active_profile')?.value

  const isProfileValid = validProfiles.some(p => p.id === activeProfileCookie)

  if (activeProfileCookie && isProfileValid) {
    return activeProfileCookie
  }

  // Default to the first profile if cookie is missing or spoofed
  return validProfiles[0].id
}
