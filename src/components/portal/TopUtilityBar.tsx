'use client'

import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { switchActiveProfile, signOut } from '@/app/patient-portal/portal-actions'
import styles from './PortalShell.module.css'

type Profile = {
  id: string
  full_name: string
  mrn: string
}

export default function TopUtilityBar({ 
  activeProfileId, 
  profiles 
}: { 
  activeProfileId: string
  profiles: Profile[] 
}) {
  const pathname = usePathname()

  // Map route to human-readable title
  const getPageTitle = () => {
    if (pathname.includes('/records')) return 'Diagnostic Records'
    if (pathname.includes('/reports')) return 'Lab Reports'
    if (pathname.includes('/profile')) return 'My Profile'
    if (pathname.includes('/change-password')) return 'Security'
    return 'Dashboard Overview'
  }

  const handleProfileChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value
    await switchActiveProfile(newId)
  }

  return (
    <header className={styles.topUtilityBar}>
      <h1 className={styles.pageTitle}>{getPageTitle()}</h1>

      <div className={styles.utilityActions}>
        {profiles.length > 1 && (
          <select 
            className={styles.profileSelect}
            value={activeProfileId}
            onChange={handleProfileChange}
            aria-label="Switch active patient profile"
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name} ({p.mrn})
              </option>
            ))}
          </select>
        )}

        {profiles.length === 1 && (
          <span className="hidden sm:inline-block text-sm font-medium text-gray-500">
            {profiles[0].full_name}
          </span>
        )}

        <form action={signOut}>
          <button type="submit" className={styles.logoutButton} aria-label="Sign out">
            <LogOut className={styles.icon} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </form>
      </div>
    </header>
  )
}
