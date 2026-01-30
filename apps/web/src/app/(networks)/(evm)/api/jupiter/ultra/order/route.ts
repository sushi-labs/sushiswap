import type { NextRequest } from 'next/server'
import { JUPITER_ULTRA_API_BASE_URL } from 'src/lib/swap/jupiter-ultra-api'

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams

    const response = await fetch(
      `${JUPITER_ULTRA_API_BASE_URL}/order?${query.toString()}`,
      {
        method: 'GET',
        headers: {
          'x-api-key': process.env.JUPITER_API_KEY as string,
        },
      },
    )

    console.log(response)

    return new Response(await response.text(), {
      status: response.status,
      headers: {
        'Content-Type':
          response.headers.get('content-type') ?? 'application/json',
      },
    })
  } catch (error) {
    console.error('Error in /api/jupiter/ultra/order:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
