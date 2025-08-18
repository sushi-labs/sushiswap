import type { NextRequest } from 'next/server'
import { bladeDepositSchema } from 'src/lib/wagmi/hooks/pools/hooks/use-blade-deposit-params'

export async function GET(request: NextRequest) {
  if (!process.env.BLADE_API_V2_KEY) {
    return Response.json(
      { error: 'BLADE_API_V2_KEY is not set' },
      {
        status: 500,
      },
    )
  }
  const params = Object.fromEntries(request.nextUrl.searchParams.entries())
  const { ...parsedParams } = bladeDepositSchema.parse(params)

  const url = new URL('https://blade-api.sushi.com/rfq/v2/deposit')

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': process.env.BLADE_API_V2_KEY,
    },
    body: JSON.stringify({
      ...parsedParams,
    }),
  }

  try {
    const response = await fetch(url, options)

    return Response.json(await response.json(), {
      status: response.status,
    })
  } catch (error) {
    const _error = error as BladeErrorResponse
    return Response.json(
      {
        errorMessage: _error?.errorMessage || 'An unexpected error occurred',
        errorType: _error?.errorType || 'UnknownError',
        errorCode: _error?.errorCode || 500,
        data: _error?.data || [],
      },
      {
        status: _error?.errorCode || 500,
      },
    )
  }
}

type BladeErrorResponse = {
  errorMessage: string
  errorType: string
  errorCode?: 422 | 409 | 400 | 401 | 403 | 500 | 503 // it is returned only when we have a clipper code for the error
  data?: unknown[] // is is returned only when the input data is invalid
}
