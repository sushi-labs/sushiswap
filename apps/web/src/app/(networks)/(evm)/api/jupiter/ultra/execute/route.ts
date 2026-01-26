import type { NextRequest } from 'next/server'
import { JUPITER_ULTRA_API_BASE_URL } from 'src/lib/swap/jupiter-ultra-api'

export async function POST(request: NextRequest) {
  const response = await fetch(`${JUPITER_ULTRA_API_BASE_URL}/execute`, {
    method: 'POST',
    headers: {
      'x-api-key': process.env.JUPITER_API_KEY as string,
      'Content-Type': request.headers.get('content-type') ?? 'application/json',
    },
    body: await request.text(),
  })

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      'Content-Type':
        response.headers.get('content-type') ?? 'application/json',
    },
  })
}
