'use client'

import { useEffect, useRef } from 'react'
import { signOut } from '@/app/patient-portal/portal-actions'

const LAST_ACTIVITY_KEY = 'wasfa_last_activity'
const THROTTLE_MS = 2000 // Throttle updates to at most once every 2 seconds
const CHECK_INTERVAL_MS = 30000 // Check for timeout every 30 seconds

export default function SessionTimeout({ timeoutMinutes = 15 }: { timeoutMinutes?: number }) {
  const lastUpdateRef = useRef<number>(0)

  useEffect(() => {
    // 1. Function to mark activity in localStorage
    const updateActivity = () => {
      const now = Date.now()
      // Throttle updates to avoid main thread lag during mousemove/scroll
      if (now - lastUpdateRef.current > THROTTLE_MS) {
        localStorage.setItem(LAST_ACTIVITY_KEY, now.toString())
        lastUpdateRef.current = now
      }
    }

    // 2. Initialize activity when component mounts
    updateActivity()

    // 3. Attach event listeners for user interaction
    // We use { passive: true } to ensure scrolling performance isn't blocked
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']
    events.forEach(event => document.addEventListener(event, updateActivity, { passive: true }))

    // 4. Periodically check if the user has been inactive for too long across ALL tabs
    const intervalId = setInterval(() => {
      const lastActivityStr = localStorage.getItem(LAST_ACTIVITY_KEY)
      if (lastActivityStr) {
        const lastActivity = parseInt(lastActivityStr, 10)
        const now = Date.now()
        const timeoutMs = timeoutMinutes * 60 * 1000

        if (now - lastActivity > timeoutMs) {
          // Time expired! Sign out.
          clearInterval(intervalId)
          localStorage.removeItem(LAST_ACTIVITY_KEY)
          
          // Execute server action to destroy session and redirect
          signOut()
        }
      }
    }, CHECK_INTERVAL_MS)

    // 5. Cleanup on unmount
    return () => {
      events.forEach(event => document.removeEventListener(event, updateActivity))
      clearInterval(intervalId)
    }
  }, [timeoutMinutes])

  return null
}
