import { type NextRequest, NextResponse } from 'next/server'
import { verifyTurnstileJwt } from 'src/app/_common/turnstile/jwt'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const jwt = body.jwt as string
  try {
    verifyTurnstileJwt(jwt)
  } catch {
    console.error('Invalid Turnstile JWT')
    return NextResponse.json(
      { error: 'Invalid Turnstile JWT' },
      { status: 401 },
    )
  }

  const response = await fetch(body.url)
  return response
}
