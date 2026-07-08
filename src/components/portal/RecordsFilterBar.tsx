'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState, useEffect } from 'react'
import { Search } from 'lucide-react'

export function RecordsFilterBarInner() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentTab = searchParams.get('tab') || 'tests'
  const currentQuery = searchParams.get('q') || ''
  const currentMonth = searchParams.get('month') || ''

  const [localQuery, setLocalQuery] = useState(currentQuery)

  // Create a new URLSearchParams object and push
  const updateParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Always reset to page 1 when changing filters
    params.set('page', '1')

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    router.push(`${pathname}?${params.toString()}`)
  }, [searchParams, pathname, router])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== currentQuery) {
        updateParams({ q: localQuery })
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [localQuery, currentQuery, updateParams])

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
      
      {/* Segmented Control */}
      <div className="flex bg-[#fdfafb] p-1 rounded-lg border border-[#f0e6ea] w-full sm:w-auto">
        <button
          onClick={() => updateParams({ tab: 'tests' })}
          className={`flex-1 sm:flex-none px-6 py-1.5 text-sm font-medium rounded-md transition-colors ${
            currentTab === 'tests' 
              ? 'bg-white text-[#b81d3f] shadow-sm border border-[#f0e6ea]' 
              : 'text-[#4a3f44] hover:text-[#b81d3f]'
          }`}
        >
          Tests
        </button>
        <button
          onClick={() => updateParams({ tab: 'checkups' })}
          className={`flex-1 sm:flex-none px-6 py-1.5 text-sm font-medium rounded-md transition-colors ${
            currentTab === 'checkups' 
              ? 'bg-white text-[#b81d3f] shadow-sm border border-[#f0e6ea]' 
              : 'text-[#4a3f44] hover:text-[#b81d3f]'
          }`}
        >
          Checkups
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search reference..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="block w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm text-[#24171c] focus:outline-none focus:ring-1 focus:ring-[#b81d3f] focus:border-[#b81d3f]"
          />
        </div>

        {/* Month Filter */}
        <input
          type="month"
          value={currentMonth}
          onChange={(e) => updateParams({ month: e.target.value })}
          className="block w-full sm:w-auto px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-[#24171c] focus:outline-none focus:ring-1 focus:ring-[#b81d3f] focus:border-[#b81d3f] bg-transparent"
        />
      </div>

    </div>
  )
}

import { Suspense } from 'react'

export default function RecordsFilterBar() {
  return (
    <Suspense fallback={<div className="h-16 w-full bg-white rounded-xl border border-gray-100 shadow-sm mb-6 animate-pulse" />}>
      <RecordsFilterBarInner />
    </Suspense>
  )
}
