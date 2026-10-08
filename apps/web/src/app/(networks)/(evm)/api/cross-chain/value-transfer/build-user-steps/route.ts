import {
  buildValueTransferUserSteps,
  createValueTransferErrorResponse,
  readValueTransferRequest,
} from 'src/lib/swap/value-transfer/client'
import { valueTransferBuildUserStepsRequestSchema } from 'src/lib/swap/value-transfer/schemas'

export async function POST(request: Request): Promise<Response> {
  try {
    const input = await readValueTransferRequest(
      request,
      valueTransferBuildUserStepsRequestSchema,
    )
    const result = await buildValueTransferUserSteps(input)
    return Response.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    return createValueTransferErrorResponse(error)
  }
}
