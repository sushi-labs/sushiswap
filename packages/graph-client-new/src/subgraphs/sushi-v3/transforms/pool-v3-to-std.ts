import type { ResultOf } from 'gql.tada'
import type { PoolFieldsFragment } from 'src/subgraphs/sushi-v3/fragments/pool-fields'
import type { SushiSwapV3ChainId } from 'sushi/config'
import { getIdFromChainIdAddress } from 'sushi/format'
import { type Address, type SushiPoolV3, SushiSwapProtocol } from 'sushi/types'

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

type RequiredBase = Pick<ResultOf<typeof PoolFieldsFragment>, ToPick>

export function transformPoolV3ToStd<T extends RequiredBase>(
  pool: T,
  chainId: SushiSwapV3ChainId,
): SushiPoolV3 {
  return {
    id: getIdFromChainIdAddress(chainId, pool.id as Address),
    address: pool.id as Address,
    chainId,
    name: `${pool.token0.symbol}-${pool.token1.symbol}`,

    swapFee: Number(pool.swapFee) / 10000,
    // twapEnabled: pool.twapEnabled,

    feeGrowthGlobal0X128: BigInt(pool.feeGrowthGlobal0X128),
    feeGrowthGlobal1X128: BigInt(pool.feeGrowthGlobal1X128),
    observationIndex: BigInt(pool.observationIndex),
    sqrtPrice: BigInt(pool.sqrtPrice),
    tick: BigInt(pool.tick),

    protocol: SushiSwapProtocol.SUSHISWAP_V3,

    reserve0: pool.reserve0,
    reserve1: pool.reserve1,
    liquidity: pool.liquidity,
    liquidityUSD: Number(pool.liquidityUSD),

    volumeUSD: Number(pool.volumeUSD),
    feesUSD: Number(pool.volumeUSD) * 0.003,

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

    txCount: pool.txCount,
  }
}
