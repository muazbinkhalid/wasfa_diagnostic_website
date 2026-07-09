import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            const { maxAge, expires, ...sessionOptions } = options
            supabaseResponse.cookies.set(name, value, sessionOptions)
          })
        },
      },
    }
  )

  // Refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/patient-portal') && pathname !== '/patient-portal') {
    if (!user) {
      // User is not authenticated, redirect to sign-in page
      const url = request.nextUrl.clone()
      url.pathname = '/patient-portal'
      return NextResponse.redirect(url)
    }
  }

  if (pathname === '/patient-portal' && user) {
    // User is authenticated, redirect to dashboard
    const url = request.nextUrl.clone()
    url.pathname = '/patient-portal/dashboard'
    return NextResponse.redirect(url)
  }

  // AGGRESSIVE SESSION TERMINATION:
  // If the user navigates away from the patient portal (e.g., to the home page `/`),
  // destroy their session entirely.
  if (!pathname.startsWith('/patient-portal') && !pathname.startsWith('/api')) {
    if (user) {
      // The user is leaving the portal, kill the session
      await supabase.auth.signOut()
      
      // Clear the local profile cookie as well
      supabaseResponse.cookies.set('wasfa_active_profile', '', { maxAge: 0, path: '/' })
      
      // Note: supabase.auth.signOut() handles clearing the auth cookies via the setAll callback above.
    }
  }

  return supabaseResponse
}
