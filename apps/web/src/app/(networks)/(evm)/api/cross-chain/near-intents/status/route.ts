import type { NextRequest } from 'next/server'
import {
  createNearIntentsErrorResponse,
  nearIntentsSdk,
} from 'src/lib/swap/near-intents/sdk'
import {
  nearIntentsStatusRequestSchema,
  normalizeNearIntentsExecutionResponse,
} from '../schemas'

export async function GET(request: NextRequest) {
  try {
    const params = nearIntentsStatusRequestSchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    )

    const response = await nearIntentsSdk.getExecutionStatus(
      params.depositAddress,
      params.depositMemo,
    )

    return Response.json(normalizeNearIntentsExecutionResponse(response))
  } catch (error) {
    return createNearIntentsErrorResponse(error)
  }
}
