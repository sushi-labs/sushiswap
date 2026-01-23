import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams
    const url = `https://lite-api.jup.ag/ultra/v1/order?${query.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.JUPITER_API_KEY as string,
      },
    })

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
