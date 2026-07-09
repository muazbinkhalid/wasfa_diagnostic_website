'use client'

import { Suspense } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './PortalDashboard.module.css'

export function RecordsPaginationInner({
  currentPage,
  totalItems,
  pageSize,
}: {
  currentPage: number
  totalItems: number
  pageSize: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const totalPages = Math.ceil(totalItems / pageSize)

  if (totalPages <= 1) return null

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const startItem = ((currentPage - 1) * pageSize) + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className={styles.pagination}>
      <p className={styles.paginationText}>
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{totalItems}</strong> records
      </p>
      <div className={styles.paginationActions}>
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={styles.button}
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={styles.button}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default function RecordsPagination(props: {
  currentPage: number
  totalItems: number
  pageSize: number
}) {
  return (
    <Suspense fallback={null}>
      <RecordsPaginationInner {...props} />
    </Suspense>
  )
}
