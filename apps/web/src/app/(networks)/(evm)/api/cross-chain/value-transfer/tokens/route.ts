import {
  createValueTransferErrorResponse,
  getValueTransferTokens,
} from 'src/lib/swap/value-transfer/client'
import { VALUE_TRANSFER_DISCOVERY_CACHE_SECONDS } from 'src/lib/swap/value-transfer/config'
import { valueTransferTokensRequestSchema } from 'src/lib/swap/value-transfer/schemas'

export async function GET(request: Request): Promise<Response> {
  try {
    const input = valueTransferTokensRequestSchema.parse(
      Object.fromEntries(new URL(request.url).searchParams),
    )
    const result = await getValueTransferTokens(input)
    return Response.json(result, {
      headers: {
        'Cache-Control': `s-maxage=${VALUE_TRANSFER_DISCOVERY_CACHE_SECONDS}, stale-while-revalidate=60`,
      },
    })
  } catch (error) {
    return createValueTransferErrorResponse(error)
  }
}
