'use server'

import { headers } from 'next/headers'
import { signTurnstileJwt } from './jwt'

export async function validateTurnstileAction(token: string) {
  const headerz = await headers()
  const remoteIp = headerz.get('x-forwarded-for')

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
          remoteip: remoteIp,
        }),
      },
    )

    const result = await response.json()
    if (!result.success) {
      return { success: false } as const
    }

    const { jwt, exp } = signTurnstileJwt()

    return { success: true, exp, jwt } as const
  } catch (error) {
    console.error('Turnstile validation error:', error)
    return { success: false } as const
  }
}
