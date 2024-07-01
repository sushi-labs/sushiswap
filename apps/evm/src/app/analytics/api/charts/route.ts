import { NextResponse } from 'next/server'

import { getCharts } from '../../../../lib/graph'

export const revalidate = 3600

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const networks = searchParams.get('networks') as string
  const data = await getCharts({ networks })
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=600',
    },
  })
}
