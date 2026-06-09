import {
  createNearIntentsErrorResponse,
  nearIntentsSdk,
} from 'src/lib/swap/near-intents/sdk'
import { normalizeNearIntentsTokens } from '../schemas'

export const revalidate = 30

export async function GET() {
  try {
    const response = await nearIntentsSdk.getTokens()
    const parsed = await normalizeNearIntentsTokens(response)

    return Response.json(parsed, {
      headers: {
        'Cache-Control': 's-maxage=30, stale-while-revalidate=60',
      },
    })
  } catch (error) {
    return createNearIntentsErrorResponse(error)
  }
}
