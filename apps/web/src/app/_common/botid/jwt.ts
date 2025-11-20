const iss = 'sushi.com'
const aud = 'sushi-web'

import { randomUUID } from 'node:crypto'
import { sign, verify } from 'jsonwebtoken'

const JWT_KEY = process.env.BOTID_JWT_KEY || ''

export function signBotIdJwt() {
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + 300 // 5 minutes

  return sign(
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
  )
}

export function verifyBotIdJwt(token: string) {
  try {
    const decoded = verify(token, JWT_KEY, {
      algorithms: ['HS256'],
      issuer: iss,
      audience: aud,
      maxAge: '5m',
    })
    return decoded as { iat: number; exp: number; sub: string }
  } catch {
    return null
  }
}
