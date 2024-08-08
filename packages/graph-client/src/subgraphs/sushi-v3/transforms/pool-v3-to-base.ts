import type { ResultOf } from 'gql.tada'
import type { PoolFieldsFragment } from 'src/subgraphs/sushi-v3/fragments/pool-fields'
import type { SushiSwapV3ChainId } from 'sushi/config'
import {
  getIdFromChainIdAddress,
  withoutScientificNotation,
} from 'sushi/format'
import { SushiSwapProtocol, type Address } from 'sushi/types'

export function transformPoolV3ToBase(
  pool: ResultOf<typeof PoolFieldsFragment>,
  chainId: SushiSwapV3ChainId,
) {
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

    isProtocolFeeEnabled: pool.isProtocolFeeEnabled,
  }
}
