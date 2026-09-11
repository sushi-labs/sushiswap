import { robinhoodStockTokensSchema } from 'src/lib/robinhood/stock-tokens'

export async function GET(): Promise<Response> {
  try {
    const response = await fetch('https://api.robinhood.com/rhj/assets', {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) {
      return Response.json(
        { error: 'Failed to fetch Robinhood stock tokens' },
        { status: 502 },
      )
    }

    const data: unknown = await response.json()
    return Response.json(robinhoodStockTokensSchema.parse(data), {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    })
  } catch {
    return Response.json(
      { error: 'Robinhood stock token registry is unavailable' },
      { status: 502 },
    )
  }
}
