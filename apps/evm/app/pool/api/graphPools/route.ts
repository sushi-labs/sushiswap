import { getGraphPools } from 'lib/api'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  ids: z.string().transform((ids) => ids.split(',')),
})

// export const revalidate = 60 // revalidate every minute

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
