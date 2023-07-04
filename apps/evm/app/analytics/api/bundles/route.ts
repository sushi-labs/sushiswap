import { NextResponse } from 'next/server'

import { getBundles } from '../../lib/api'

export const revalidate = 3600

export async function GET(request: Request) {
  const bundles = await getBundles()
  return NextResponse.json(bundles)
}
