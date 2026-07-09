'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  User,
} from 'lucide-react'
import { useState } from 'react'
import styles from './PortalShell.module.css'

export default function DesktopSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    { label: 'Overview', href: '/patient-portal/dashboard', icon: LayoutDashboard },
    { label: 'Records', href: '/patient-portal/records', icon: ClipboardList },
    { label: 'Reports', href: '/patient-portal/reports', icon: FileText },
    { label: 'Profile', href: '/patient-portal/profile', icon: User },
  ]

  return (
    <aside className={`${styles.desktopSidebar} ${isCollapsed ? styles.desktopSidebarCollapsed : ''}`}>
      <div className={styles.brandHeader}>
        <div className={styles.brandLockup}>
          <span className={styles.brandMark}>
            <Image
              src="/logo.png"
              alt="Wasfa Diagnostic Centre"
              width={36}
              height={36}
              className={styles.brandLogo}
              priority
            />
          </span>
          <div className={styles.brandCopy}>
            <div className={styles.brandText} lang="ur" dir="rtl" style={{ fontFamily: 'var(--font-urdu), serif', fontSize: '1.35rem', fontWeight: 600, letterSpacing: 0, lineHeight: 1.25, textTransform: 'none' }}>وصفہ ڈائیگناسٹکس</div>
          </div>
        </div>
      </div>
      
      <nav className={styles.navRail}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={styles.icon} />
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <span className={styles.sidebarFooterIcon}>
          <ShieldCheck size={16} />
        </span>
        <div className={styles.sidebarFooterCopy}>
          <div className={styles.sidebarFooterTitle}>Secure portal</div>
          <p className={styles.sidebarFooterText}>Encrypted patient access</p>
        </div>
      </div>
      
      <div style={{ padding: '0 0.75rem 0.75rem' }}>
        <button
          type="button"
          className={styles.collapseButton}
          style={{ width: '100%' }}
          onClick={() => setIsCollapsed((current) => !current)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
        </button>
      </div>
    </aside>
  )
}
