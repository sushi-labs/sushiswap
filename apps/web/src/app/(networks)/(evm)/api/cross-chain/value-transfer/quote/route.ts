import {
  createValueTransferErrorResponse,
  getValueTransferQuote,
  readValueTransferRequest,
} from 'src/lib/swap/value-transfer/client'
import { valueTransferQuoteRequestSchema } from 'src/lib/swap/value-transfer/schemas'

export async function POST(request: Request): Promise<Response> {
  try {
    const input = await readValueTransferRequest(
      request,
      valueTransferQuoteRequestSchema,
    )
    const result = await getValueTransferQuote(input)
    return Response.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    return createValueTransferErrorResponse(error)
  }
}
