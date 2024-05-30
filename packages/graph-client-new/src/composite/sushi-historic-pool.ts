import { getBlockHistoric } from 'src/subgraphs/blocks/queries/block-historic'
import {
  type GetSushiV2Pool,
  getSushiV2Pool,
} from 'src/subgraphs/sushi-v2/queries/pool'
import { getSushiV2PoolBuckets } from 'src/subgraphs/sushi-v2/queries/pool-with-buckets'
import {
  type GetSushiV3Pool,
  getSushiV3Pool,
} from 'src/subgraphs/sushi-v3/queries/pool'
import { getSushiV3PoolBuckets } from 'src/subgraphs/sushi-v3/queries/pool-with-buckets'
import { isSushiSwapV2ChainId, isSushiSwapV3ChainId } from 'sushi/config'
import type {
  SushiPoolHistory,
  SushiPoolV2,
  SushiPoolV3,
  SushiPoolWithBuckets,
} from 'sushi/types'
import { isPromiseFulfilled } from 'sushi/validate'

export type GetSushiHistoricPool = Omit<
  GetSushiV2Pool | GetSushiV3Pool,
  'block'
>

type Result = SushiPoolHistory<SushiPoolWithBuckets<SushiPoolV2 | SushiPoolV3>>

async function fetchSushiV2Pool({
  chainId,
  ...variables
}: GetSushiV2Pool | GetSushiV3Pool) {
  if (!isSushiSwapV2ChainId(chainId)) {
    throw new Error(`ChainId ${chainId} is not a SushiSwap V2 chain`)
  }

  return await getSushiV2Pool({ chainId, ...variables })
}

async function fetchSushiV3Pool({
  chainId,
  ...variables
}: GetSushiV2Pool | GetSushiV3Pool) {
  if (!isSushiSwapV3ChainId(chainId)) {
    throw new Error(`ChainId ${chainId} is not a SushiSwap V3 chain`)
  }

  return getSushiV3Pool({ chainId, ...variables })
}

export async function getSushiHistoricPool({
  chainId,
  ...variables
}: GetSushiHistoricPool): Promise<Result> {
  const id = variables.id.toLowerCase()

  // FETCH
  const v2poolF = isSushiSwapV2ChainId(chainId)
    ? getSushiV2PoolBuckets({
        chainId,
        id,
      })
    : null
  const v3poolF = isSushiSwapV3ChainId(chainId)
    ? getSushiV3PoolBuckets({
        chainId,
        id,
      })
    : null

  const [v2poolS, v3poolS] = await Promise.allSettled([v2poolF, v3poolF])

  const v2pool = isPromiseFulfilled(v2poolS) ? v2poolS.value : null
  const v3pool = isPromiseFulfilled(v3poolS) ? v3poolS.value : null

  if (!v2pool && !v3pool) {
    throw new Error(`Failed to fetch pool ${chainId}:${variables.id}`)
  }

  const fetcher = v2pool ? fetchSushiV2Pool : fetchSushiV3Pool

  const getPoolTimeAgo = async (
    ago: Omit<Parameters<typeof getBlockHistoric>[0], 'chainId'>,
  ) => {
    return getBlockHistoric({
      chainId,
      ...ago,
    })
      .then(async (block) => {
        return fetcher({
          chainId,
          id,
          block: { number: block.number },
        })
      })
      .catch(() => null)
  }

  const pool1dP = getPoolTimeAgo({ daysAgo: 1 })
  const pool2dP = getPoolTimeAgo({ daysAgo: 2 })
  const pool1wP = getPoolTimeAgo({ weeksAgo: 1 })

  const [pool1dS, pool2dS, pool1wS] = await Promise.allSettled([
    pool1dP,
    pool2dP,
    pool1wP,
  ])

  const pool = v2pool || v3pool!
  const pool1d = isPromiseFulfilled(pool1dS) ? pool1dS.value : null
  const pool2d = isPromiseFulfilled(pool2dS) ? pool2dS.value : null
  const pool1w = isPromiseFulfilled(pool1wS) ? pool1wS.value : null

  // TRANSFORM
  const liquidityUSD1dChange = pool1d
    ? pool.liquidityUSD / pool1d.liquidityUSD - 1
    : 0
  const liquidityUSD1wChange = pool1w
    ? pool.liquidityUSD / pool1w.liquidityUSD - 1
    : 0

  const volumeUSD1d = pool1d
    ? Number(pool.volumeUSD) - Number(pool1d.volumeUSD)
    : Number(pool.volumeUSD)
  const volumeUSD2d = // Volume between 1d and 2d ago
    pool1d && pool2d
      ? Number(pool1d.volumeUSD) - Number(pool2d.volumeUSD)
      : Number(pool.volumeUSD)
  const volumeUSD1w = pool1w
    ? Number(pool.volumeUSD) - Number(pool1w.volumeUSD)
    : Number(pool.volumeUSD)
  const volumeUSD1dChange =
    pool1d && pool2d ? volumeUSD1d / volumeUSD2d - 1 : null

  const feesUSD1d = pool1d
    ? Number(pool.feesUSD) - Number(pool1d.feesUSD)
    : Number(pool.feesUSD)
  const feesUSD2d = // Fees between 1d and 2d ago
    pool1d && pool2d
      ? Number(pool1d.feesUSD) - Number(pool2d.feesUSD)
      : Number(pool.feesUSD)
  const feesUSD1w = pool1w
    ? Number(pool.feesUSD) - Number(pool1w.feesUSD)
    : Number(pool.feesUSD)
  const feesUSD1dChange = pool1d && pool2d ? feesUSD1d / feesUSD2d - 1 : null

  const txCount1d = pool1d
    ? Number(pool.txCount) - Number(pool1d.txCount)
    : Number(pool.txCount)
  const txCount2d = // Tx count between 1d and 2d ago
    pool1d && pool2d
      ? Number(pool1d.txCount) - Number(pool2d.txCount)
      : Number(pool.txCount)
  const txCount1w = pool1w
    ? Number(pool.txCount) - Number(pool1w.txCount)
    : Number(pool.txCount)
  const txCount1dChange = pool1d && pool2d ? txCount1d / txCount2d - 1 : null

  return {
    ...pool,
    liquidityUSD1dChange,
    liquidityUSD1wChange,
    volumeUSD1d,
    volumeUSD1dChange,
    volumeUSD1w,
    feesUSD1d,
    feesUSD1dChange,
    feesUSD1w,
    txCount1d,
    txCount1dChange,
    txCount1w,
  }
}
