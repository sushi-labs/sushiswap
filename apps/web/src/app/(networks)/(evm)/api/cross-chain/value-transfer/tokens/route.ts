import {
  createValueTransferErrorResponse,
  getValueTransferTokens,
} from 'src/lib/swap/value-transfer/client'
import { VALUE_TRANSFER_DISCOVERY_CACHE_CONTROL } from 'src/lib/swap/value-transfer/config'
import { valueTransferTokensRequestSchema } from 'src/lib/swap/value-transfer/schemas'

export async function GET(request: Request): Promise<Response> {
  try {
    const input = valueTransferTokensRequestSchema.parse(
      Object.fromEntries(new URL(request.url).searchParams),
    )
    const result = await getValueTransferTokens(input)
    return Response.json(result, {
      headers: {
        'Cache-Control': VALUE_TRANSFER_DISCOVERY_CACHE_CONTROL,
      },
    })
  } catch (error) {
    return createValueTransferErrorResponse(error)
  }
}
