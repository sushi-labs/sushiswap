import { NextResponse } from 'next/server'
import { getGraphPools } from 'src/lib/api'
import { z } from 'zod'

export const revalidate = 60

const schema = z.object({
  ids: z.string().transform((ids) => ids.split(',')),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ids = searchParams.get('ids')
  const result = schema.safeParse({ ids })
  if (!result.success) {
    return new Response(result.error.message, { status: 422 })
  }
  const pool = await getGraphPools(result.data.ids)
  return NextResponse.json(pool)
}
