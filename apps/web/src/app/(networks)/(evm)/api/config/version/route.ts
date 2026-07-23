import { NextResponse } from 'next/server'
import * as z from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  commit: z.string(),
})

export async function GET() {
  return NextResponse.json(
    schema.safeParse({ commit: process.env.VERCEL_GIT_COMMIT_SHA }),
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )
}
