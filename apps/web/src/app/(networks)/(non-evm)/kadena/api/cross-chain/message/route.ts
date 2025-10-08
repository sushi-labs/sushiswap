import type { NextRequest } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  hash: z.string(),
})

export const revalidate = 20

export async function GET(request: NextRequest) {
  const parsedParams = schema.safeParse({
    hash: request.nextUrl.searchParams.get('hash'),
  })

  if (!parsedParams.success) {
    return Response.json(z.treeifyError(parsedParams.error), { status: 400 })
  }

  const url = new URL('https://explorer-api.kinesisbridge.xyz/api/hash')

  url.searchParams.set('hash', parsedParams.data.hash)

  const response = await fetch(url.toString())

  return Response.json(await response.json(), {
    status: response.status,
    headers: {
      'Cache-Control': 's-maxage=8, stale-while-revalidate=20',
    },
  })
}
