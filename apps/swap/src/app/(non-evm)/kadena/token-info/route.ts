import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tokenAddress = searchParams.get('tokenAddress')
  const tokenSymbol = searchParams.get('tokenSymbol')
  const tokenDecimals = searchParams.get('tokenDecimals')
  const tokenImage = searchParams.get('tokenImage')

  return NextResponse.json({
    tokenAddress,
    tokenSymbol,
    tokenDecimals,
    tokenImage,
  })
}
