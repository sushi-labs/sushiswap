import { cacheLife } from 'next/cache'
import { type NextRequest, connection } from 'next/server'
import { JUPITER_ULTRA_API_BASE_URL } from 'src/lib/swap/jupiter-ultra-api'

async function getCachedOrder(query: string) {
  'use cache'
  cacheLife({ revalidate: 600 })

  const response = await fetch(`${JUPITER_ULTRA_API_BASE_URL}/order?${query}`, {
    method: 'GET',
    headers: {
      'x-api-key': process.env.JUPITER_API_KEY as string,
    },
  })

  return {
    body: await response.text(),
    contentType: response.headers.get('content-type') ?? 'application/json',
    status: response.status,
  }
}

export async function GET(request: NextRequest) {
  await connection()

  try {
    const query = request.nextUrl.searchParams

    const response = await getCachedOrder(query.toString())

    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': response.contentType,
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
