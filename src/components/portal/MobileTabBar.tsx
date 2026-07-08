'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, ClipboardList, User } from 'lucide-react'
import styles from './PortalShell.module.css'

export default function MobileTabBar() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Overview', href: '/patient-portal/dashboard', icon: LayoutDashboard },
    { label: 'Records', href: '/patient-portal/records', icon: ClipboardList },
    { label: 'Reports', href: '/patient-portal/reports', icon: FileText },
    { label: 'Profile', href: '/patient-portal/profile', icon: User },
  ]

  return (
    <nav className={styles.mobileTabBar}>
      <div className={styles.mobileNavGrid}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.mobileNavItem} ${isActive ? styles.mobileNavItemActive : ''}`}
            >
              <Icon className={styles.icon} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
