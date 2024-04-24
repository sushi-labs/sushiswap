import { NextResponse } from 'next/server'

import { getToken } from '../../../../../lib/graph'

export const revalidate = 3600

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id') as string
  const [token] = await Promise.all([getToken(id)])
  return NextResponse.json({ token })
}
