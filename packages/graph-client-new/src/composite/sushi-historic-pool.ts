import { getBlockHistoric } from 'src/subgraphs/blocks/queries/block-historic'
import {
  type GetSushiV2Pool,
  getSushiV2Pool,
} from 'src/subgraphs/sushi-v2/queries/pool'
import { transformPoolV2ToV3 } from 'src/subgraphs/sushi-v2/transforms/pool-v2-to-v3'
import {
  type GetSushiV3Pool,
  getSushiV3Pool,
} from 'src/subgraphs/sushi-v3/queries/pool'
import { isSushiSwapV2ChainId, isSushiSwapV3ChainId } from 'sushi/config'
import { isPromiseFulfilled } from 'sushi/validate'

export type GetSushiHistoricPool = Omit<
  GetSushiV2Pool | GetSushiV3Pool,
  'block'
>

async function fetchSushiV2Pool({
  chainId,
  ...variables
}: GetSushiV2Pool | GetSushiV3Pool) {
  if (!isSushiSwapV2ChainId(chainId)) {
    throw new Error(`ChainId ${chainId} is not a SushiSwap V2 chain`)
  }

  return transformPoolV2ToV3(await getSushiV2Pool({ chainId, ...variables }))
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
}: GetSushiHistoricPool) {
  const v2poolF = isSushiSwapV2ChainId(chainId) ? getSushiV2Pool : null
  const v3poolF = isSushiSwapV3ChainId(chainId) ? getSushiV3Pool : null

  const [v2poolS, v3poolS] = await Promise.allSettled([v2poolF, v3poolF])

  const v2pool = isPromiseFulfilled(v2poolS) ? v2poolS.value : null
  const v3pool = isPromiseFulfilled(v3poolS) ? v3poolS.value : null

  if (!v2pool && !v3pool) {
    throw new Error(`Failed to fetch pool ${chainId}:${variables.id}`)
  }

  const fetcher = v2pool ? fetchSushiV2Pool : fetchSushiV3Pool

  const pool1dP = getBlockHistoric({
    chainId,
    daysAgo: 1,
  })
    .then(async (block) => {
      return fetcher({
        chainId,
        ...variables,
        block: { number: block.number },
      })
    })
    .catch(() => null)

  const pool2dP = getBlockHistoric({
    chainId,
    daysAgo: 2,
  })
    .then(async (block) => {
      return fetcher({
        chainId,
        ...variables,
        block: { number: block.number },
      })
    })
    .catch(() => null)

  const pool1wP = getBlockHistoric({
    chainId,
    weeksAgo: 1,
  })
    .then(async (block) => {
      return fetcher({
        chainId,
        ...variables,
        block: { number: block.number },
      })
    })
    .catch(() => null)

  const [pool1dS, pool2dS, pool1wS] = await Promise.allSettled([
    pool1dP,
    pool2dP,
    pool1wP,
  ])

  const pool1d = isPromiseFulfilled(pool1dS) ? pool1dS.value : null
  const pool2d = isPromiseFulfilled(pool2dS) ? pool2dS.value : null
  const pool1w = isPromiseFulfilled(pool1wS) ? pool1wS.value : null

  console.log(pool1d, pool2d, pool1w)
}
