'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { LogOut, UserRound } from 'lucide-react'
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
  const router = useRouter()

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
    router.refresh()
  }

  return (
    <header className={styles.topUtilityBar}>
      <div className={styles.titleCluster}>
        <span className={styles.titleIcon} aria-hidden="true">
          <Image
            src="/logo.png"
            alt=""
            width={30}
            height={30}
            className={styles.titleLogo}
            priority
          />
        </span>
        <div>
          <span className={styles.pageKicker}>Patient portal</span>
          <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
        </div>
      </div>

      <div className={styles.utilityActions}>
        {profiles.length > 1 && (
          <label className={styles.profileSelectWrap}>
            <UserRound size={16} aria-hidden="true" />
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
          </label>
        )}

        {profiles.length === 1 && (
          <span className={styles.activeProfileName}>
            <UserRound size={16} aria-hidden="true" />
            {profiles[0].full_name}
          </span>
        )}

        <form action={signOut}>
          <button type="submit" className={styles.logoutButton} aria-label="Sign out">
            <LogOut className={styles.icon} />
            <span className={styles.logoutText}>Sign Out</span>
          </button>
        </form>
      </div>
    </header>
  )
}
