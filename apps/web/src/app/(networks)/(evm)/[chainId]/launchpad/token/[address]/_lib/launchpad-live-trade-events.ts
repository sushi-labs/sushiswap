import ms from 'ms'
import { type EvmAddress, type EvmTxHash, szevm } from 'sushi/evm'
import { isAddressEqual, isHash } from 'viem'
import { z } from 'zod'
import { type LaunchpadChainId, isLaunchpadChainId } from '../../../constants'

const evmAddressSchema = szevm.address()
const transactionHashSchema = z.custom<EvmTxHash>(
  (value) => typeof value === 'string' && isHash(value),
  'Invalid transaction hash',
)
const launchpadChainIdSchema = z.custom<LaunchpadChainId>(
  (value) =>
    typeof value === 'number' &&
    Number.isInteger(value) &&
    isLaunchpadChainId(value),
  'Invalid launchpad chain ID',
)
const unsignedIntegerSchema = z.string().regex(/^(0|[1-9][0-9]*)$/)
const streamIdentitySchema = z.object({
  chainId: launchpadChainIdSchema,
  tokenAddress: evmAddressSchema,
  eventId: unsignedIntegerSchema,
})
const streamTradeSchema = streamIdentitySchema.extend({
  isNew: z.boolean(),
  id: z.string().min(1),
  poolAddress: evmAddressSchema,
  feeTier: z.number().int().nonnegative(),
  isLaunchPool: z.boolean(),
  transactionHash: transactionHashSchema,
  logIndex: z.number().int().nonnegative(),
  blockNumber: unsignedIntegerSchema,
  timestamp: z.string().datetime(),
  trader: evmAddressSchema.nullable(),
  direction: z.enum(['BUY', 'SELL']),
  tokenAmount: unsignedIntegerSchema,
  quoteToken: z.object({
    address: evmAddressSchema,
    symbol: z.string().min(1),
    name: z.string().min(1),
    decimals: z.number().int().nonnegative(),
  }),
  quoteAmount: unsignedIntegerSchema,
  marginalPriceUsd: z.number().nonnegative().nullable(),
  priceUsd: z.number().nonnegative().nullable(),
  amountUsd: z.number().nonnegative().nullable(),
})
const streamTradeRemoveSchema = streamIdentitySchema.extend({
  transactionHash: transactionHashSchema,
  logIndex: z.number().int().nonnegative(),
})
const streamResetSchema = streamIdentitySchema.extend({
  reason: z.enum(['CURSOR_EXPIRED', 'CURSOR_INVALID']),
})
const candleIntervalSchema = z.enum(['1m', '5m', '15m', '1h', '4h', '1d'])
const candleSchema = z.object({
  timestamp: z.number().int().nonnegative(),
  open: z.number().nonnegative(),
  high: z.number().nonnegative(),
  low: z.number().nonnegative(),
  close: z.number().nonnegative(),
  volumeUsd: z.number().nonnegative(),
  tradeCount: z.number().int().nonnegative(),
})
const streamCandleSchema = streamIdentitySchema.extend({
  interval: candleIntervalSchema,
  candle: candleSchema,
})
const streamCandleRemoveSchema = streamIdentitySchema.extend({
  interval: candleIntervalSchema,
  timestamp: z.number().int().nonnegative(),
})
const nullableWindowValuesSchema = z.object({
  h1: z.number().nullable(),
  h6: z.number().nullable(),
  h12: z.number().nullable(),
  h24: z.number().nullable(),
})
const metricsSchema = z.object({
  priceUsd: z.number().nonnegative().nullable(),
  marketCapitalizationUsd: z.number().nonnegative().nullable(),
  fullyDilutedValuationUsd: z.number().nonnegative().nullable(),
  currentTvlUsd: z.number().nonnegative().nullable(),
  volumeUsd: nullableWindowValuesSchema,
  tvlChangePercent: nullableWindowValuesSchema,
  asOf: z.string().datetime(),
  source: z.string().min(1),
  isStale: z.boolean(),
})
const streamMetricsSchema = streamIdentitySchema.extend({
  version: unsignedIntegerSchema,
  metrics: metricsSchema,
})

function parseStreamEvent<T>(
  event: MessageEvent<string>,
  schema: z.ZodType<T>,
): T | null {
  try {
    const parsed: unknown = JSON.parse(event.data)
    const result = schema.safeParse(parsed)
    return result.success ? result.data : null
  } catch {
    return null
  }
}

function parseLaunchpadMetricsStreamEvent(
  event: MessageEvent<string>,
): z.infer<typeof streamMetricsSchema> | null {
  return parseStreamEvent(event, streamMetricsSchema)
}

function parseLaunchpadTradeStreamEvent(
  event: MessageEvent<string>,
): z.infer<typeof streamTradeSchema> | null {
  return parseStreamEvent(event, streamTradeSchema)
}

function parseLaunchpadTradeResetStreamEvent(
  event: MessageEvent<string>,
): z.infer<typeof streamIdentitySchema> | null {
  return parseStreamEvent(event, streamIdentitySchema)
}

function isExpectedStream(
  chainId: LaunchpadChainId,
  tokenAddress: EvmAddress,
  event: { chainId: number; tokenAddress: EvmAddress },
): boolean {
  return (
    event.chainId === chainId &&
    isAddressEqual(event.tokenAddress, tokenAddress)
  )
}

const closedStreamRetryDelay = ms('2s')
const tradeSnapshotRetryBaseDelay = ms('2s')
const tradeSnapshotRetryMaxDelay = ms('30s')

export {
  closedStreamRetryDelay,
  isExpectedStream,
  parseLaunchpadMetricsStreamEvent,
  parseLaunchpadTradeResetStreamEvent,
  parseLaunchpadTradeStreamEvent,
  parseStreamEvent,
  streamCandleRemoveSchema,
  streamCandleSchema,
  streamIdentitySchema,
  streamMetricsSchema,
  streamResetSchema,
  streamTradeRemoveSchema,
  streamTradeSchema,
  tradeSnapshotRetryBaseDelay,
  tradeSnapshotRetryMaxDelay,
  unsignedIntegerSchema,
}
