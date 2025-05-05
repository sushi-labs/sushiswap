'use server'

import { headers } from 'next/headers'

export async function getBaseUrl() {
  const headers_ = await headers()
  const host = headers_.get('Host')!
  const proto = headers_.get('X-Forwarded-Proto') || 'https'

  return `${proto}://${host}`
}
