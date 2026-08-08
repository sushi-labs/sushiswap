import { get } from '@vercel/edge-config'
import { cacheLife } from 'next/cache'
import { NextResponse } from 'next/server'
import * as z from 'zod'

const schema = z.object({
  maintenance: z.boolean(),
})

// export const runtime = 'edge'

async function getXSwapConfig() {
  'use cache'
  cacheLife('minutes')

  try {
    return schema.safeParse(await get('xswap'))
  } catch {
    return schema.safeParse(undefined)
  }
}

export async function GET() {
  return NextResponse.json(await getXSwapConfig())
}
