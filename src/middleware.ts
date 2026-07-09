import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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
      const redirectResponse = NextResponse.redirect(url)
      
      // Persist the cookies into the redirect response
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value)
      })
      
      return redirectResponse
    }
  }

  if (pathname === '/patient-portal' && user) {
    // User is authenticated, redirect to dashboard
    const url = request.nextUrl.clone()
    url.pathname = '/patient-portal/dashboard'
    const redirectResponse = NextResponse.redirect(url)
    
    // Persist the cookies into the redirect response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    
    return redirectResponse
  }

  // AGGRESSIVE SESSION TERMINATION:
  // Only terminate if the user navigates explicitly to the home page (/).
  // Terminating on any non-patient-portal path risks breaking static assets and browser requests.
  if (pathname === '/') {
    if (user) {
      // The user is leaving the portal, kill the session
      await supabase.auth.signOut()
      
      // Clear the local profile cookie as well
      supabaseResponse.cookies.set('wasfa_active_profile', '', { maxAge: 0, path: '/' })
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
