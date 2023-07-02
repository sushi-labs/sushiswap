import { getGraphPool } from 'lib/api'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  id: z.string(),
})

// uses thegraph, not the pools api
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const result = schema.safeParse({ id })
  if (!result.success) {
    return new Response(result.error.message, { status: 400 })
  }

  const pool = await getGraphPool(result.data.id)
  NextResponse.json(pool)
}
