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
  PoolBase,
  PoolHistory1D,
  PoolV2,
  PoolV3,
  PoolWithBuckets,
} from 'sushi/types'
import { isPromiseFulfilled } from 'sushi/validate'

export type GetSushiHistoricPool = Omit<
  GetSushiV2Pool | GetSushiV3Pool,
  'block'
>

type Result = PoolHistory1D<
  PoolWithBuckets<PoolV2<PoolBase> | PoolV3<PoolBase>>
>

async function fetchSushiV2Pool({
  chainId,
  ...variables
}: GetSushiV2Pool | GetSushiV3Pool) {
  if (!isSushiSwapV2ChainId(chainId)) {
    throw new Error(`ChainId ${chainId} is not a SushiSwap V2 chain`)
  }

  return getSushiV2Pool({ chainId, ...variables })
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

  const [pool1dS, pool2dS] = await Promise.allSettled([pool1dP, pool2dP])

  const pool = v2pool || v3pool!
  const pool1d = isPromiseFulfilled(pool1dS) ? pool1dS.value : null
  const pool2d = isPromiseFulfilled(pool2dS) ? pool2dS.value : null

  // TRANSFORM
  const liquidityUSD1dChange = calculatePercentageChange(
    pool.liquidityUSD,
    pool1d?.liquidityUSD,
    pool2d?.liquidityUSD,
  )

  const volumeUSD1d = calculateValueChange(pool.volumeUSD, pool1d?.volumeUSD)
  const volumeUSD1dChange = calculatePercentageChange(
    pool.volumeUSD,
    pool1d?.volumeUSD,
    pool2d?.volumeUSD,
  )

  const feesUSD1d = calculateValueChange(pool.feesUSD, pool1d?.feesUSD)
  const feesUSD1dChange = calculatePercentageChange(
    pool.feesUSD,
    pool1d?.feesUSD,
    pool2d?.feesUSD,
  )
  const txCount1d = calculateValueChange(pool.txCount, pool1d?.txCount)
  const txCount1dChange = calculatePercentageChange(
    pool.txCount,
    pool1d?.txCount,
    pool2d?.txCount,
  )

  return {
    ...pool,
    liquidityUSD1dChange,
    volumeUSD1d,
    volumeUSD1dChange,
    feesUSD1d,
    feesUSD1dChange,
    txCount1d,
    txCount1dChange,
  }
}

const calculateValueChange = (
  current: string | number | bigint | undefined,
  previous: string | number | bigint | undefined,
) => {
  const _current = Number(current)
  const _previous = Number(previous)
  if (_current === 0) return 0
  return _previous !== 0 ? _current - _previous : 0
}

const calculatePercentageChange = (
  current: string | number | bigint | undefined,
  previous: string | number | bigint | undefined,
  previous2: string | number | bigint | undefined,
) => {
  const _current = Number(current)
  const _previous = Number(previous)
  const _previous2 = Number(previous2)
  if (_current === 0) return 0
  const change1 = _previous !== 0 ? _current - _previous : 0
  const change2 =
    _previous !== 0 && _previous2 !== 0 ? _previous - _previous2 : 0
  if (change2 === 0) return 0 // avoid division by 0
  return _previous !== 0 && _previous2 !== 0 ? change1 / change2 - 1 : 0
}
