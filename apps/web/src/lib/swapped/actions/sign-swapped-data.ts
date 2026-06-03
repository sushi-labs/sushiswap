'use server'

import { createHmac } from 'node:crypto'

if (process.env.VERCEL && !process.env.SWAPPED_SECRET_KEY) {
  throw new Error('SWAPPED_SECRET_KEY is not set')
}
const SWAPPED_SECRET_KEY =
  process.env.SWAPPED_SECRET_KEY ??
  'sk_sandbox_gV4eT2aK5bP6C7nR3fWmQxY8FdZ9HhE2' //sandbox sk

export async function signSwappedData(url: string) {
  return createHmac('sha256', SWAPPED_SECRET_KEY)
    .update(new URL(url).search)
    .digest('hex')
}
