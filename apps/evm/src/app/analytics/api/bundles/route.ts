import { NextResponse } from 'next/server'

import { getBundles } from '../../../../lib/analytics/api'

export const revalidate = 3600

export async function GET() {
  const bundles = await getBundles()
  return NextResponse.json(bundles)
}
