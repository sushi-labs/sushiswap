import { get } from '@vercel/edge-config'
import { cacheLife } from 'next/cache'
import { NextResponse } from 'next/server'
import * as z from 'zod'

const schema = z.object({
  maintenance: z.boolean(),
})

async function getNearIntentsXSwapConfig() {
  'use cache'
  cacheLife('minutes')

  try {
    return schema.safeParse(await get('near-intents-xswap'))
  } catch {
    return schema.safeParse(undefined)
  }
}

export async function GET() {
  return NextResponse.json(await getNearIntentsXSwapConfig())
}
