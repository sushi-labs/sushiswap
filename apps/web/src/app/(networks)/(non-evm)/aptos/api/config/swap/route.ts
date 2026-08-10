import { get } from '@vercel/edge-config'
import { NextResponse, connection } from 'next/server'
import * as z from 'zod'

const schema = z.object({
  maintenance: z.boolean(),
})

// Incident kill switch polled by the client every minute — never cached.
export async function GET() {
  await connection()

  try {
    return NextResponse.json(schema.safeParse(await get('swap')), {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch {
    return NextResponse.json(schema.safeParse(undefined), {
      headers: { 'Cache-Control': 'no-store' },
    })
  }
}
