import type { NextRequest } from 'next/server'
import {
  createNearIntentsErrorResponse,
  nearIntentsSdk,
} from 'src/lib/swap/near-intents/sdk'
import {
  buildNearIntentsSdkQuoteRequest,
  nearIntentsQuoteRequestSchema,
  normalizeNearIntentsQuoteResponse,
} from '../schemas'

export async function POST(request: NextRequest) {
  try {
    const body = nearIntentsQuoteRequestSchema.parse(await request.json())
    const response = await nearIntentsSdk.getQuote(
      buildNearIntentsSdkQuoteRequest(body),
    )

    return Response.json(normalizeNearIntentsQuoteResponse(response))
  } catch (error) {
    return createNearIntentsErrorResponse(error)
  }
}
