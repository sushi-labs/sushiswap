import { NextResponse } from 'next/server';

import { KADENA_TOKENS } from '@/config/tokens/kadena';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tokenAddress = searchParams.get('tokenAddress')

    if (!tokenAddress) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token address is required',
        },
        { status: 400 },
      )
    }

    const token = KADENA_TOKENS.find(
      (t) => t.tokenAddress.toLowerCase() === tokenAddress.toLowerCase(),
    )

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token not found',
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        tokenAddress: token.tokenAddress,
        tokenSymbol: token.tokenSymbol,
        tokenDecimals: token.tokenDecimals,
        tokenImage: token.tokenImage,
        name: token.name,
        validated: token.validated,
        tokenInfo: token.tokenInfo,
      },
    })
  } catch (error) {
    console.error('Error in token-info route:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 },
    )
  }
}
