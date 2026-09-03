import { StrKey } from '@stellar/stellar-sdk'
import { StellarChainId } from 'sushi/stellar'
import { z } from 'zod'
import {
  LAYERZERO_STELLAR_OFT_ADDRESS,
  LAYERZERO_USDT0_EVM_DEPLOYMENTS,
  type LayerZeroChainId,
  getLayerZeroEid,
} from './config'

const MAX_AGE_SECONDS = 7 * 24 * 60 * 60
const MIN_SAMPLES = 3
const MAX_SAMPLES = 20
const responseSchema = z.object({ data: z.array(z.unknown()) })
const timestampSchema = z.number().int().positive()
const messageSchema = z.object({
  pathway: z.object({
    srcEid: z.number(),
    dstEid: z.number(),
    sender: z.object({ address: z.string() }),
    receiver: z.object({ address: z.string() }),
  }),
  status: z.object({ name: z.literal('DELIVERED') }),
  source: z.object({ tx: z.object({ blockTimestamp: timestampSchema }) }),
  destination: z.object({ tx: z.object({ blockTimestamp: timestampSchema }) }),
})

function getScanOftAddress(chainId: LayerZeroChainId): string {
  return chainId === StellarChainId.STELLAR
    ? `0x${StrKey.decodeContract(LAYERZERO_STELLAR_OFT_ADDRESS).toString('hex')}`
    : LAYERZERO_USDT0_EVM_DEPLOYMENTS[chainId].oftAddress.toLowerCase()
}

export function getLayerZeroArrivalEstimateUrl(
  fromChainId: LayerZeroChainId,
  toChainId: LayerZeroChainId,
): string {
  const params = new URLSearchParams({
    srcChainIds: String(getLayerZeroEid(fromChainId)),
    dstChainIds: String(getLayerZeroEid(toChainId)),
    srcOrDstChainIdUaAddress: `${getLayerZeroEid(fromChainId)}-${getScanOftAddress(fromChainId)}`,
    limit: String(MAX_SAMPLES),
  })
  return `https://scan.layerzero-api.com/v1/messages/latest?${params}`
}

/** Typical source-inclusion → destination-credit time, not a delivery guarantee.
 * Uses the documented Scan transaction timestamps, never indexing/update times:
 * https://scan.layerzero-api.com/v1/openapi
 */
export function getLayerZeroArrivalEstimate(
  response: unknown,
  fromChainId: LayerZeroChainId,
  toChainId: LayerZeroChainId,
  nowSeconds = Math.floor(Date.now() / 1000),
): { estimatedSeconds: number | null } {
  const { data } = responseSchema.parse(response)
  const srcEid = getLayerZeroEid(fromChainId)
  const dstEid = getLayerZeroEid(toChainId)
  const sender = getScanOftAddress(fromChainId)
  const receiver = getScanOftAddress(toChainId)
  const samples = data
    .flatMap((value) => {
      const parsed = messageSchema.safeParse(value)
      if (!parsed.success) return []
      const { pathway, source, destination } = parsed.data
      const start = source.tx.blockTimestamp
      const end = destination.tx.blockTimestamp
      if (
        pathway.srcEid !== srcEid ||
        pathway.dstEid !== dstEid ||
        pathway.sender.address.toLowerCase() !== sender ||
        pathway.receiver.address.toLowerCase() !== receiver ||
        start < nowSeconds - MAX_AGE_SECONDS ||
        end > nowSeconds ||
        end <= start
      )
        return []
      return [{ start, seconds: end - start }]
    })
    .sort((a, b) => b.start - a.start)
    .slice(0, MAX_SAMPLES)

  if (samples.length < MIN_SAMPLES) return { estimatedSeconds: null }
  // The median represents a typical transfer without being dominated by a
  // single historical delivery incident. Slow transfers are not discarded.
  const seconds = samples.map((sample) => sample.seconds).sort((a, b) => a - b)
  const middle = Math.floor(seconds.length / 2)
  const median =
    seconds.length % 2 === 0
      ? (seconds[middle - 1]! + seconds[middle]!) / 2
      : seconds[middle]!
  return { estimatedSeconds: Math.ceil(median) }
}
