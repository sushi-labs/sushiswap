import { NextResponse } from 'next/server'

import { getTokenCount } from '../../../../../lib/graph'

export const revalidate = 3600

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const networks = searchParams.get('networks') as string
  const bundles = await getTokenCount({ networks })
  return NextResponse.json(bundles)
}
