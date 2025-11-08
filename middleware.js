import { NextResponse } from 'next/server'

/**
 * Mode B Middleware — Simple, Stable, Cookie-Based Protection
 *
 * Fungsi:
 * - Tidak memakai Supabase client di Edge (menghindari RSC/ERR_ABORTED)
 * - Tidak memanggil API verify (itu Mode C)
 * - Cukup mendeteksi keberadaan cookie Supabase:
 *      - sb-access-token
 *      - sb-refresh-token
 *      - sb-session
 *
 * Jika TIDAK ada cookie session → redirect ke halaman login (/)
 *
 * Catatan:
 * - Cookie ini ditulis oleh endpoint /api/auth (POST) setelah login selesai.
 * - Cukup aman untuk aplikasi internal.
 */

export function middleware(req) {
  const pathname = req.nextUrl.pathname

  // Lindungi rute dashboard
  if (pathname.startsWith('/dashboard')) {
    const cookie = req.headers.get('cookie') || ''

    const hasSession =
      cookie.includes('sb-access-token') ||
      cookie.includes('sb-refresh-token') ||
      cookie.includes('sb-session') ||
      cookie.includes('supabase-auth-token') ||
      cookie.includes('sb:')

    if (!hasSession) {
      // Tidak ada session → redirect ke / (login)
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
