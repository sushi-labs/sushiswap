import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import {
  type EvmID,
  EvmToken,
  type PoolBase,
  type PoolV3,
  SUSHI_DATA_API_HOST,
  SushiSwapProtocol,
  isSushiSwapV3ChainId,
} from 'sushi/evm'
import type { Address } from 'viem'
import { graphql } from '../../graphql.js'

export const V3PoolsByTokensQuery = graphql(
  `
    query V3PoolsByTokens($token0: Bytes!, $token1: Bytes!, $chainId: SushiSwapV3ChainId!) {
    v3PoolsByTokens(token0: $token0, token1: $token1, chainId: $chainId) {
        id
        address
        chainId
        protocol
        name
        createdAt
        swapFee
        isProtocolFeeEnabled
        token0 {
        id
        chainId
        address
        name
        symbol
        decimals
        }
        token1 {
        id
        chainId
        address
        name
        symbol
        decimals
        }
        source
        reserve0
        reserve1
        liquidity
        token0Price
        token1Price
        sqrtPrice
        tick
        observationIndex
        feeGrowthGlobal0X128
        feeGrowthGlobal1X128
        volumeUSD
        liquidityUSD
        feesUSD
        txCount
    }
    }
`,
)

export type GetV3BasePoolsByTokens = VariablesOf<typeof V3PoolsByTokensQuery>

export async function getV3BasePoolsByToken(
  variables: GetV3BasePoolsByTokens,
  options?: RequestOptions,
): Promise<PoolV3<PoolBase>[]> {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  const chainId = variables.chainId

  if (!isSushiSwapV3ChainId(chainId)) {
    throw new Error('Invalid chainId')
  }

  const tokens = [variables.token0, variables.token1].sort() as [
    `0x${string}`,
    `0x${string}`,
  ]

  const result = await request(
    {
      url,
      document: V3PoolsByTokensQuery,
      variables: {
        chainId: chainId,
        token0: tokens[0].toLowerCase(),
        token1: tokens[1].toLowerCase(),
      },
    },
    options,
  )

  if (result.v3PoolsByTokens) {
    return result.v3PoolsByTokens.map(
      (pool) =>
        ({
          id: pool.id as EvmID,
          address: pool.address as Address,
          chainId,
          name: pool.name,
          swapFee: pool.swapFee,
          protocol: SushiSwapProtocol.SUSHISWAP_V3,
          isProtocolFeeEnabled: pool.isProtocolFeeEnabled,
          token0: new EvmToken({
            address: pool.token0.address as Address,
            chainId,
            decimals: pool.token0.decimals,
            name: pool.token0.name,
            symbol: pool.token0.symbol,
          }),
          token1: new EvmToken({
            address: pool.token1.address as Address,
            chainId,
            decimals: pool.token1.decimals,
            name: pool.token1.name,
            symbol: pool.token1.symbol,
          }),

          reserve0: BigInt(pool.reserve0),
          reserve1: BigInt(pool.reserve1),
          liquidity: BigInt(pool.liquidity),
          token0Price: pool.token0Price,
          token1Price: pool.token1Price,

          sqrtPrice: BigInt(pool.sqrtPrice),
          tick: BigInt(pool.tick),
          observationIndex: BigInt(pool.observationIndex),
          feeGrowthGlobal0X128: BigInt(pool.feeGrowthGlobal0X128),
          feeGrowthGlobal1X128: BigInt(pool.feeGrowthGlobal1X128),

          liquidityUSD: pool.liquidityUSD,
          volumeUSD: pool.volumeUSD,
          feesUSD: pool.feesUSD,
          txCount: pool.txCount,
        }) satisfies PoolV3<PoolBase>,
    )
  }

  throw new Error('No pool found')
}
