import { z } from 'zod'
import type { LayerZeroStatus } from './types'

const responseSchema = z.object({
  data: z.array(
    z.object({
      pathway: z.object({ srcEid: z.number(), dstEid: z.number() }),
      status: z.object({ name: z.string() }),
      destination: z
        .object({ tx: z.object({ txHash: z.string().nullish() }).nullish() })
        .nullish(),
    }),
  ),
})

export function parseLayerZeroStatus(
  response: unknown,
  srcEid: number,
  dstEid: number,
): LayerZeroStatus {
  const { data } = responseSchema.parse(response)
  const message = data.find(
    ({ pathway }) => pathway.srcEid === srcEid && pathway.dstEid === dstEid,
  )
  const name = message?.status.name
  return {
    status:
      name === 'DELIVERED'
        ? 'SUCCESS'
        : name && ['FAILED', 'PAYLOAD_STORED', 'BLOCKED'].includes(name)
          ? 'ACTION_REQUIRED'
          : 'PENDING',
    destinationTxHash: message?.destination?.tx?.txHash ?? undefined,
  }
}
