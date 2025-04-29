import { NextResponse } from 'next/server';

import { KADENA_TOKENS } from '@/config/tokens/kadena';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: KADENA_TOKENS.map((token) => ({
        tokenAddress: token.tokenAddress,
        tokenSymbol: token.tokenSymbol,
        tokenDecimals: token.tokenDecimals,
        tokenImage: token.tokenImage,
        name: token.name,
        validated: token.validated,
        tokenInfo: token.tokenInfo,
      })),
    })
  } catch (error) {
    console.error('Error in tokens route:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 },
    )
  }
}
