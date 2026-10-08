import {
  createValueTransferErrorResponse,
  readValueTransferRequest,
  submitValueTransferSignature,
} from 'src/lib/swap/value-transfer/client'
import { valueTransferSubmitSignatureRequestSchema } from 'src/lib/swap/value-transfer/schemas'

export async function POST(request: Request): Promise<Response> {
  try {
    const input = await readValueTransferRequest(
      request,
      valueTransferSubmitSignatureRequestSchema,
    )
    const result = await submitValueTransferSignature(input)
    return Response.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    return createValueTransferErrorResponse(error)
  }
}
