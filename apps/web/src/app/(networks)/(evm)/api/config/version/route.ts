import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  deploymentId: z.string(),
})

export async function GET() {
  return NextResponse.json(
    schema.safeParse({ deploymentId: process.env.VERCEL_DEPLOYMENT_ID }),
    {
      headers: {
        'Cache-Control': 'max-age=300',
      },
    },
  )
}
