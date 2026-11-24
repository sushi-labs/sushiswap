import {
  type EvmAddress,
  EvmChainId,
  type SushiSwapV3ChainId,
  getSushiSwapV3SubgraphUrl,
} from 'sushi/evm'
import { getSubgraphUrl } from '../../../../lib/get-subgraph-url.js'
import { type RequestOptions, request } from '../../../../lib/request.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

const DAY = 86_400
const DAYS = { '1D': 1, '1W': 7, '1M': 30, '1Y': 365 }

export type V3PoolPricePeriod = keyof typeof DAYS | 'ALL'

export interface V3PoolPricePoint {
  /** Unix seconds. */
  timestamp: number
  /** Token1 per token0, in whole-token units. */
  price: number
}

interface PriceHistoryInput {
  chainId: SushiSwapV3ChainId
  address: EvmAddress
  period: V3PoolPricePeriod
}

type HistoryOptions = RequestOptions & { signal?: AbortSignal }

interface PriceBucket {
  timestamp: number
  price: string
}

async function getBucketHistory(
  url: string,
  pool: string,
  from: number,
  now: number,
  hourly: boolean,
  options: HistoryOptions,
): Promise<V3PoolPricePoint[]> {
  const entity = hourly ? 'poolHourDatas' : 'poolDayDatas'
  const time = hourly ? 'periodStartUnix' : 'date'
  const interval = hourly ? 3600 : DAY
  const start = Math.floor(from / interval) * interval
  const document = `query PoolPriceHistory($pool: String!, $from: Int!, $to: Int!, $opening: Boolean!) {
    _meta { block { timestamp } }
    buckets: ${entity}(first: 1000, orderBy: ${time}, orderDirection: desc,
      where: { pool: $pool, ${time}_gte: $from, ${time}_lt: $to }) {
      timestamp: ${time}
      price: token1Price
    }
    previous: ${entity}(first: 1, orderBy: ${time}, orderDirection: desc,
      where: { pool: $pool, ${time}_lt: $from }) @include(if: $opening) {
      timestamp: ${time}
      price: token1Price
    }
  }`

  const points: V3PoolPricePoint[] = []
  let openingPrice = 0
  let to = now + 1
  let indexedAt = now
  let nextBucketStart: number | undefined
  do {
    const result = await request<{
      _meta?: { block: { timestamp: number | null } } | null
      buckets: PriceBucket[]
      previous?: PriceBucket[]
    }>(
      {
        url,
        document,
        variables: {
          pool,
          from: start,
          to,
          opening: from > 0 && to === now + 1,
        },
        signal: options.signal,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    const indexedTimestamp = result._meta?.block.timestamp
    if (
      to === now + 1 &&
      indexedTimestamp &&
      Number.isSafeInteger(indexedTimestamp)
    ) {
      indexedAt = Math.min(now, indexedTimestamp)
      if (indexedAt < from) return []
      nextBucketStart = Math.floor(indexedAt / interval) * interval
    }
    if (result.previous?.length)
      openingPrice = Number(result.previous[0]?.price)

    for (const bucket of result.buckets) {
      const price = Number(bucket.price)
      // The snapshot is the last price in the bucket. Plot it at the close.
      const timestamp = Math.min(bucket.timestamp + interval, indexedAt)
      if (
        Number.isSafeInteger(bucket.timestamp) &&
        timestamp !== points.at(-1)?.timestamp &&
        Number.isFinite(price) &&
        price > 0
      ) {
        // In a gap the pool holds its prior price until the next occupied bucket.
        if (nextBucketStart !== undefined && timestamp < nextBucketStart) {
          points.push({ timestamp: nextBucketStart, price })
        }
        points.push({ timestamp, price })
        // An indexer exactly on a boundary can already have the new bucket's price.
        nextBucketStart = Math.min(bucket.timestamp, timestamp - 1)
      }
    }
    const oldest = result.buckets.at(-1)?.timestamp
    if (result.buckets.length < 1000 || oldest === undefined) break
    if (!Number.isSafeInteger(oldest) || oldest >= to) {
      throw new Error('Invalid pool price history cursor')
    }
    to = oldest
  } while (to > start)

  if (
    Number.isFinite(openingPrice) &&
    openingPrice > 0 &&
    from !== points.at(-1)?.timestamp
  ) {
    if (nextBucketStart !== undefined && from < nextBucketStart) {
      points.push({ timestamp: nextBucketStart, price: openingPrice })
    }
    points.push({ timestamp: from, price: openingPrice })
  }
  return points.reverse()
}

const poolInfoQuery = `query PoolPriceMetadata($pool: String!) {
  swaps(first: 1, where: { pool: $pool }, orderBy: timestamp, orderDirection: asc) {
    timestamp
    pool { token0 { decimals } token1 { decimals } }
  }
}`

interface PriceMetadata {
  timestamp: string
  pool: { token0: { decimals: string }; token1: { decimals: string } }
}

// Reduced subgraphs retain each swap's post-swap price, but omit prices from
// their hourly/daily buckets. Sample the last known swap at each instant.
async function getSwapHistory(
  url: string,
  pool: string,
  from: number,
  now: number,
  options: HistoryOptions,
): Promise<V3PoolPricePoint[]> {
  const requestParams = {
    url,
    signal: options.signal,
    requestHeaders: SUSHI_REQUEST_HEADERS,
  }
  const metadata = await request<{ swaps: PriceMetadata[] }>(
    {
      ...requestParams,
      document: poolInfoQuery,
      variables: { pool },
    },
    options,
  )
  const firstSwap = metadata.swaps[0]
  if (!firstSwap) return []
  const start = Math.max(from, Number(firstSwap.timestamp))
  const decimals0 = Number(firstSwap.pool.token0.decimals)
  const decimals1 = Number(firstSwap.pool.token1.decimals)
  if (
    !Number.isSafeInteger(start) ||
    start <= 0 ||
    start > now ||
    ![decimals0, decimals1].every(
      (n) => Number.isInteger(n) && n >= 0 && n <= 255,
    )
  ) {
    throw new Error('Invalid pool price metadata')
  }
  const scale = 10 ** (decimals0 - decimals1)
  const points: V3PoolPricePoint[] = []
  // Bound query work even for All Time, while including both endpoints.
  const intervals = Math.min(95, now - start)
  const times = Array.from({ length: intervals + 1 }, (_, i) =>
    intervals ? start + Math.floor(((now - start) * i) / intervals) : start,
  )
  for (let i = 0; i < times.length; i += 24) {
    const batch = times.slice(i, i + 24)
    const fields = batch.map(
      (time, index) =>
        `p${index}: swaps(first: 1, where: { pool: $pool, timestamp_lte: "${time}" },
        orderBy: timestamp, orderDirection: desc) { sqrtPriceX96 }`,
    )
    const samples = await request<Record<string, { sqrtPriceX96: string }[]>>(
      {
        ...requestParams,
        document: `query PoolPriceSamples($pool: String!) { ${fields.join('\n')} }`,
        variables: { pool },
      },
      options,
    )
    for (const [index, timestamp] of batch.entries()) {
      const sqrtPrice =
        Number(samples[`p${index}`]?.[0]?.sqrtPriceX96) / 2 ** 96
      const price = sqrtPrice ** 2 * scale
      if (Number.isFinite(price) && price > 0) points.push({ timestamp, price })
    }
  }
  return points
}

export async function getV3PoolPriceHistory(
  { chainId, address, period }: PriceHistoryInput,
  options: HistoryOptions = {},
): Promise<V3PoolPricePoint[]> {
  const url = getSubgraphUrl({ chainId, getter: getSushiSwapV3SubgraphUrl })
  const pool = address.toLowerCase()
  const now = Math.floor(Date.now() / 1000)
  const from = period === 'ALL' ? 0 : now - DAYS[period] * DAY
  if (chainId === EvmChainId.ROBINHOOD || chainId === EvmChainId.ARC) {
    return getSwapHistory(url, pool, from, now, options)
  }
  return getBucketHistory(
    url,
    pool,
    from,
    now,
    period !== '1Y' && period !== 'ALL',
    options,
  )
}
