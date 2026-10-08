import {
  createValueTransferErrorResponse,
  getValueTransferStatus,
} from 'src/lib/swap/value-transfer/client'
import { valueTransferStatusRequestSchema } from 'src/lib/swap/value-transfer/schemas'

export async function GET(request: Request): Promise<Response> {
  try {
    const input = valueTransferStatusRequestSchema.parse(
      Object.fromEntries(new URL(request.url).searchParams),
    )
    const result = await getValueTransferStatus(input)
    return Response.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    return createValueTransferErrorResponse(error)
  }
}
