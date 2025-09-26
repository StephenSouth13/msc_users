// middleware.ts - Supabase SSR middleware
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If env vars are missing (common in local/dev preview), skip Supabase middleware
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('Skipping Supabase middleware: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set')
    }
    return response
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        // update request cookies and response cookies safely
        request.cookies.set({ name, value })
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        response.cookies.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        request.cookies.delete(name)
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        response.cookies.delete({ name, ...options })
      },
    },
  })

  try {
    // This will refresh session if expired - required for Server Components
    await supabase.auth.getUser()
  } catch (err) {
    // Do not crash the middleware if Supabase call fails
    // eslint-disable-next-line no-console
    console.error('Supabase middleware error:', err)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
