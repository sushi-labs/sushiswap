import { NextResponse } from 'next/server'
import { KADENA_TOKENS } from '~kadena/_common/constants/token-list'

export async function GET() {
  const tokens = KADENA_TOKENS.slice(0, -1)
  try {
    const response = NextResponse.json({
      success: true,
      data: tokens.map((token) => ({
        tokenAddress: token.tokenAddress,
        tokenSymbol: token.tokenSymbol,
        tokenDecimals: token.tokenDecimals,
        tokenImage: token.tokenImage,
        name: token.name,
        validated: token.validated,
        tokenInfo: token.tokenInfo,
      })),
    })

    return response
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
