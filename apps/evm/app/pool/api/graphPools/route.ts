import { getGraphPools } from 'lib/api'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  ids: z.string().transform((ids) => ids.split(',')),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ids = searchParams.get('ids')
  const result = schema.safeParse({ ids })
  if (!result.success) {
    return new Response(result.error.message, { status: 400 })
  }
  const pool = await getGraphPools(result.data.ids)
  NextResponse.json(pool)
}
