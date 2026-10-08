import {
  createValueTransferErrorResponse,
  getValueTransferMetadata,
} from 'src/lib/swap/value-transfer/client'
import { VALUE_TRANSFER_DISCOVERY_CACHE_SECONDS } from 'src/lib/swap/value-transfer/config'

export async function GET(): Promise<Response> {
  try {
    const result = await getValueTransferMetadata()
    return Response.json(result, {
      headers: {
        'Cache-Control': `s-maxage=${VALUE_TRANSFER_DISCOVERY_CACHE_SECONDS}, stale-while-revalidate=60`,
      },
    })
  } catch (error) {
    return createValueTransferErrorResponse(error)
  }
}
