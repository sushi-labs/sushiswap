import { NextResponse } from 'next/server'
import { getGraphPool } from 'src/lib/api'
import { z } from 'zod'

export const revalidate = 15

const schema = z.object({
  id: z.string(),
})

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
