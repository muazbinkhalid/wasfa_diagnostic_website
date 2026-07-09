'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import styles from './PortalDashboard.module.css'

export function RecordsFilterBarInner() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentTab = searchParams.get('tab') || 'tests'
  const currentQuery = searchParams.get('q') || ''
  const currentMonth = searchParams.get('month') || ''

  const [localQuery, setLocalQuery] = useState(currentQuery)

  const updateParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', '1')

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }, [searchParams, pathname, router])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (localQuery !== currentQuery) {
        updateParams({ q: localQuery })
      }
    }, 400)

    return () => window.clearTimeout(timer)
  }, [localQuery, currentQuery, updateParams])

  return (
    <div className={styles.filterBar}>
      <div className={styles.segmentedControl} aria-label="Record type">
        <button
          type="button"
          onClick={() => updateParams({ tab: 'tests' })}
          className={`${styles.segmentButton} ${currentTab === 'tests' ? styles.segmentButtonActive : ''}`}
          aria-pressed={currentTab === 'tests'}
        >
          Tests
        </button>
        <button
          type="button"
          onClick={() => updateParams({ tab: 'checkups' })}
          className={`${styles.segmentButton} ${currentTab === 'checkups' ? styles.segmentButtonActive : ''}`}
          aria-pressed={currentTab === 'checkups'}
        >
          Checkups
        </button>
      </div>

      <div className={styles.filterControls}>
        <label className={styles.searchWrap}>
          <span className={styles.srOnly}>Search records</span>
          <Search className={styles.searchIcon} aria-hidden="true" />
          <input
            type="text"
            placeholder={currentTab === 'checkups' ? 'Search referring doctor' : 'Search reference or test'}
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className={styles.searchField}
          />
        </label>

        <label className={styles.monthWrap}>
          <span className={styles.srOnly}>Month</span>
          <input
            type="month"
            value={currentMonth}
            onChange={(e) => updateParams({ month: e.target.value })}
            className={styles.monthField}
          />
        </label>
      </div>
    </div>
  )
}

export default function RecordsFilterBar() {
  return (
    <Suspense fallback={<div className={styles.filterBar} aria-hidden="true" />}>
      <RecordsFilterBarInner />
    </Suspense>
  )
}
