import { NextResponse } from 'next/server'
import { getV2GraphPool } from 'src/lib/graph'
import { serialize } from 'sushi/bigint-serializer'
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

  const pool = await getV2GraphPool(result.data.id)
  const stringified = serialize(pool)
  return new NextResponse(stringified, {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}
