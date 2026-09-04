import { get } from '@vercel/edge-config'
import { NextResponse, connection } from 'next/server'
import { z } from 'zod'

const schema = z.object({ maintenance: z.boolean() })

export async function GET(): Promise<NextResponse> {
  await connection()
  try {
    return NextResponse.json(schema.safeParse(await get('layerzero-xswap')), {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch {
    return NextResponse.json(schema.safeParse(undefined), {
      headers: { 'Cache-Control': 'no-store' },
    })
  }
}
