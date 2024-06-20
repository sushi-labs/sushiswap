import type { ResultOf } from 'gql.tada'
import type { PoolFieldsFragment } from 'src/subgraphs/sushi-v3/fragments/pool-fields'
import type { SushiSwapV3ChainId } from 'sushi/config'
import {
  getIdFromChainIdAddress,
  withoutScientificNotation,
} from 'sushi/format'
import {
  type Address,
  type PoolBase,
  type PoolV3,
  SushiSwapProtocol,
} from 'sushi/types'

type ToPick =
  | 'id'
  | 'token0'
  | 'token1'
  | 'reserve0'
  | 'reserve1'
  | 'liquidityUSD'
  | 'volumeUSD'
  | 'txCount'
  | 'swapFee'
  | 'liquidity'
  | 'feeGrowthGlobal0X128'
  | 'feeGrowthGlobal1X128'
  | 'observationIndex'
  | 'sqrtPrice'
  | 'tick'
  | 'token0Price'
  | 'token1Price'

type RequiredBase = Pick<ResultOf<typeof PoolFieldsFragment>, ToPick>

export function transformPoolV3ToBase<T extends RequiredBase>(
  pool: T,
  chainId: SushiSwapV3ChainId,
): PoolV3<PoolBase> {
  const swapFee = Number(pool.swapFee) / 1000000

  return {
    id: getIdFromChainIdAddress(chainId, pool.id as Address),
    address: pool.id as Address,
    chainId,
    name: `${pool.token0.symbol}-${pool.token1.symbol}`,

    swapFee: swapFee,
    // twapEnabled: pool.twapEnabled,

    feeGrowthGlobal0X128: BigInt(pool.feeGrowthGlobal0X128),
    feeGrowthGlobal1X128: BigInt(pool.feeGrowthGlobal1X128),
    observationIndex: BigInt(pool.observationIndex),
    sqrtPrice: BigInt(pool.sqrtPrice),
    tick: BigInt(pool.tick ?? 0),

    protocol: SushiSwapProtocol.SUSHISWAP_V3,

    reserve0: BigInt(
      withoutScientificNotation(
        (Number(pool.reserve0) * 10 ** Number(pool.token0.decimals)).toFixed(),
      )!,
    ),
    reserve1: BigInt(
      withoutScientificNotation(
        (Number(pool.reserve1) * 10 ** Number(pool.token1.decimals)).toFixed(),
      )!,
    ),
    liquidity: BigInt(pool.liquidity),
    liquidityUSD: Number(pool.liquidityUSD),

    volumeUSD: Number(pool.volumeUSD),
    feesUSD: Number(pool.volumeUSD) * swapFee,

    token0: {
      id: getIdFromChainIdAddress(chainId, pool.token0.id as Address),
      address: pool.token0.id as Address,
      chainId,
      decimals: Number(pool.token0.decimals),
      name: pool.token0.name,
      symbol: pool.token0.symbol,
    },
    token1: {
      id: getIdFromChainIdAddress(chainId, pool.token1.id as Address),
      address: pool.token1.id as Address,
      chainId,
      decimals: Number(pool.token1.decimals),
      name: pool.token1.name,
      symbol: pool.token1.symbol,
    },

    token0Price: Number(pool.token0Price),
    token1Price: Number(pool.token1Price),

    txCount: Number(pool.txCount),
  }
}
