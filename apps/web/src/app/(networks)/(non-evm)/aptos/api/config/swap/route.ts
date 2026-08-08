import { get } from '@vercel/edge-config'
import { NextResponse } from 'next/server'
import * as z from 'zod'

const schema = z.object({
  maintenance: z.boolean(),
})

export async function GET() {
  try {
    return NextResponse.json(schema.safeParse(await get('swap')))
  } catch {
    return NextResponse.json(schema.safeParse(undefined))
  }
}
