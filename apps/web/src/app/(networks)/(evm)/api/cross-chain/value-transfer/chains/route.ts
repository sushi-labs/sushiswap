import {
  createValueTransferErrorResponse,
  getValueTransferChains,
} from 'src/lib/swap/value-transfer/client'
import { VALUE_TRANSFER_DISCOVERY_CACHE_CONTROL } from 'src/lib/swap/value-transfer/config'

export async function GET(): Promise<Response> {
  try {
    const result = await getValueTransferChains()
    return Response.json(result, {
      headers: {
        'Cache-Control': VALUE_TRANSFER_DISCOVERY_CACHE_CONTROL,
      },
    })
  } catch (error) {
    return createValueTransferErrorResponse(error)
  }
}
