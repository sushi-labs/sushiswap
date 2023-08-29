// import { get } from '@vercel/edge-config'
import { NextResponse } from 'next/server'

export const revalidate = 3600

export async function GET(request: Request) {
  //   const swapApi = await get('swap-api')
  return NextResponse.json({ swapApi: 'false' })
}
