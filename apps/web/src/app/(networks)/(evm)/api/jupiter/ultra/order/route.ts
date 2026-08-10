import { type NextRequest, connection } from 'next/server'
import { JUPITER_ULTRA_API_BASE_URL } from 'src/lib/swap/jupiter-ultra-api'

export async function GET(request: NextRequest) {
  // Marks the route dynamic before the try/catch, so the prerender bail-out
  // signal raised by `nextUrl.searchParams` cannot be swallowed as a 500.
  await connection()

  try {
    const query = request.nextUrl.searchParams

    // Deliberately uncached: the response carries a live quote and a
    // time-limited unsigned transaction, and the client repolls it every few
    // seconds. Caching it would serve stale prices and expired blockhashes.
    const response = await fetch(
      `${JUPITER_ULTRA_API_BASE_URL}/order?${query.toString()}`,
      {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'x-api-key': process.env.JUPITER_API_KEY as string,
        },
      },
    )

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
