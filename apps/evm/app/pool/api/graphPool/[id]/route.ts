import { getGraphPool } from 'lib/api'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  id: z.string(),
})

// export const revalidate = 60 // revalidate every minute

// uses thegraph, not the pools api
export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const result = schema.safeParse(params)
  if (!result.success) {
    return new Response(result.error.message, { status: 400 })
  }

  const pool = await getGraphPool(result.data.id)
  return NextResponse.json(pool)
}
