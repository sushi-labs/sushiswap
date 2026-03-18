'use server'

import { createHmac } from 'node:crypto'

if (process.env.VERCEL && !process.env.ONRAMPER_SECRET_KEY) {
  throw new Error('ONRAMPER_SECRET_KEY is not set')
}
const ONRAMPER_SECRET_KEY = process.env.ONRAMPER_SECRET_KEY ?? 'dummy'

export async function signOnramperData(data: string) {
  return createHmac('sha256', ONRAMPER_SECRET_KEY).update(data).digest('hex')
}
