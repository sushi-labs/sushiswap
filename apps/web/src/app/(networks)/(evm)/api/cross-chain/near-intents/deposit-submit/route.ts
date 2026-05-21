import type { NextRequest } from 'next/server'
import {
  createNearIntentsErrorResponse,
  nearIntentsSdk,
} from 'src/lib/swap/near-intents/sdk'
import {
  nearIntentsDepositSubmitRequestSchema,
  normalizeNearIntentsExecutionResponse,
} from '../schemas'

export async function POST(request: NextRequest) {
  try {
    const body = nearIntentsDepositSubmitRequestSchema.parse(
      await request.json(),
    )

    const response = await nearIntentsSdk.submitDepositTx(body)

    return Response.json(normalizeNearIntentsExecutionResponse(response))
  } catch (error) {
    return createNearIntentsErrorResponse(error)
  }
}
