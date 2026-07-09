import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DesktopSidebar from '@/components/portal/DesktopSidebar'
import TopUtilityBar from '@/components/portal/TopUtilityBar'
import MobileTabBar from '@/components/portal/MobileTabBar'
import { getSecureActiveProfileId } from '@/utils/profile'
import SessionTimeout from '@/components/portal/SessionTimeout'
import styles from '@/components/portal/PortalShell.module.css'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // 1. Validate session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/patient-portal')
  }

  // 2. Fetch authorized profiles
  const { data: profiles, error } = await supabase
    .from('patients')
    .select('id, full_name, mrn, portal_enabled, is_active')
    .eq('auth_user_id', user.id)

  if (error || !profiles || profiles.length === 0) {
    await supabase.auth.signOut()
    redirect('/patient-portal?error=Patient record not found')
  }

  // Filter out disabled/inactive accounts
  const validProfiles = profiles.filter(p => p.portal_enabled && p.is_active)
  
  if (validProfiles.length === 0) {
    await supabase.auth.signOut()
    redirect('/patient-portal?error=Portal access is disabled for this account')
  }

  const finalProfileId = await getSecureActiveProfileId()

  if (!finalProfileId) {
    // If somehow even getSecureActiveProfileId fails, default to validProfiles[0] to avoid crash
    // though getSecureActiveProfileId handles this.
  }

  const safeProfileId = finalProfileId || validProfiles[0].id

  return (
    <div className={styles.layout}>
      <SessionTimeout timeoutMinutes={15} />
      <DesktopSidebar />
      <div className={styles.mainWrapper}>
        <TopUtilityBar 
          activeProfileId={safeProfileId} 
          profiles={validProfiles} 
        />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
      <MobileTabBar />
    </div>
  )
}
