// app/api/auth/route.ts
import { NextResponse } from 'next/server'

function createCookieString(name: string, value: string, maxAgeSeconds?: number) {
  const parts = [
    `${name}=${encodeURIComponent(value || '')}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ]

  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    parts.push('Secure')
  }

  if (typeof maxAgeSeconds === 'number') {
    parts.push(`Max-Age=${maxAgeSeconds}`)
  }

  return parts.join('; ')
}

export async function POST(req: Request) {
  try {
    const session = await req.json()

    if (!session?.access_token) {
      return NextResponse.json({ error: 'Invalid session payload' }, { status: 400 })
    }

    const accessCookie = createCookieString(
      'sb-access-token',
      session.access_token,
      session.expires_in ?? 3600
    )

    const refreshCookie = createCookieString(
      'sb-refresh-token',
      session.refresh_token,
      60 * 60 * 24 * 30
    )

    const sessionCookie = createCookieString(
      'sb-session',
      JSON.stringify(session),
      60 * 60 * 24 * 30
    )

    // ✅ FIX: Use Headers instead of object literal (TypeScript-safe)
    const headers = new Headers()
    headers.append('Set-Cookie', accessCookie)
    headers.append('Set-Cookie', refreshCookie)
    headers.append('Set-Cookie', sessionCookie)

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE() {
  const clear = (name: string) =>
    `${name}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax${
      process.env.VERCEL || process.env.NODE_ENV === 'production' ? '; Secure' : ''
    }`

  const headers = new Headers()
  headers.append('Set-Cookie', clear('sb-access-token'))
  headers.append('Set-Cookie', clear('sb-refresh-token'))
  headers.append('Set-Cookie', clear('sb-session'))

  return new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers,
  })
}

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const has =
    cookie.includes('sb-access-token') ||
    cookie.includes('sb-session')

  if (has) {
    return NextResponse.json({ authenticated: true }, { status: 200 })
  }

  return NextResponse.json({ authenticated: false }, { status: 401 })
}