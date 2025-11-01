const iss = 'sushi.com'
const aud = 'sushi-web'

import { randomUUID } from 'node:crypto'
import { sign, verify } from 'jsonwebtoken'

const JWT_KEY = process.env.TURNSTILE_JWT_KEY || ''

export function signTurnstileJwt() {
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + 300 // 5 minutes

  return {
    exp,
    jwt: sign(
      {
        iss: iss,
        aud: aud,
        iat: iat,
        exp: exp,
        sub: randomUUID(),
      },
      JWT_KEY,
      {
        algorithm: 'HS256',
      },
    ),
  }
}

export function verifyTurnstileJwt(token: string) {
  try {
    const decoded = verify(token, JWT_KEY, {
      algorithms: ['HS256'],
      issuer: iss,
      audience: aud,
      maxAge: '5m',
    })
    return decoded as { iat: number; exp: number; sub: string }
  } catch (error) {
    console.error('Turnstile JWT verification error:', error)
    return null
  }
}
