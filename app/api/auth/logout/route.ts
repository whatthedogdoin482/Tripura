import { NextResponse } from 'next/server'
import { COOKIE_NAME } from '@/lib/auth/jwt'

export async function POST(request: Request) {
  const url = new URL(request.url)
  const response = NextResponse.json({ ok: true })

  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })

  return response
}

