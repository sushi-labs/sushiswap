import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { type EvmCurrency, type EvmID, SushiSwapProtocol } from 'sushi/evm'
import type { Hex } from 'viem'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'
import { isSushiSwapV4ChainId } from '../../types/SushiSwapV4ChainId.js'
import { hydratePoolCurrency, toRawPoolToken } from './pool-token.js'

export const V4PoolQuery = graphql(
  `
  query V4Pool($poolId: Bytes!, $chainId: SushiSwapV4ChainId!) {
    v4Pool(poolId: $poolId, chainId: $chainId) {
      id
      chainId
      name
      address
      swapFee
      isDynamicFee
      token0 {
        address
        name
        symbol
        decimals
      }
      token1 {
        address
        name
        symbol
        decimals
      }
      reserve0
      reserve1
      liquidityUSD
      token0PriceUSD
      token1PriceUSD
      volumeUSD1d
      feeUSD1d
      txCount1d
      feeApr1d
      totalApr1d
      volumeUSD1dChange
      feeUSD1dChange
      txCount1dChange
      liquidityUSD1dChange
      incentiveApr
      isIncentivized
      wasIncentivized
      hadSmartPool
      hasSmartPool
    }
  }
`,
)

export type GetV4Pool = VariablesOf<typeof V4PoolQuery>

export async function getV4Pool(
  variables: GetV4Pool,
  options?: RequestOptions,
) {
  const url = SUSHI_DATA_API_GRAPHQL_URL
  const chainId = Number(variables.chainId)

  if (!isSushiSwapV4ChainId(chainId)) {
    throw new Error('Invalid chainId')
  }

  try {
    const result = await request(
      {
        url,
        document: V4PoolQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )

    if (result.v4Pool) {
      const pool = result.v4Pool

      return {
        id: pool.id as EvmID,
        /** The V4 pool ID, kept under `address` for parity with V2/V3 pools. */
        address: pool.address as Hex,
        chainId,
        name: `${pool.token0.symbol}-${pool.token1.symbol}`,
        swapFee: pool.swapFee,
        isDynamicFee: pool.isDynamicFee,
        protocol: SushiSwapProtocol.SUSHISWAP_V4,

        token0: toRawPoolToken(pool.token0, chainId),
        token1: toRawPoolToken(pool.token1, chainId),

        reserve0: BigInt(pool.reserve0),
        reserve1: BigInt(pool.reserve1),
        liquidityUSD: pool.liquidityUSD,
        token0PriceUSD: pool.token0PriceUSD,
        token1PriceUSD: pool.token1PriceUSD,

        volumeUSD1d: pool.volumeUSD1d,
        feesUSD1d: pool.feeUSD1d,
        txCount1d: pool.txCount1d,
        liquidityUSD1dChange: pool.liquidityUSD1dChange,
        volumeUSD1dChange: pool.volumeUSD1dChange,
        feesUSD1dChange: pool.feeUSD1dChange,
        txCount1dChange: pool.txCount1dChange,

        feeApr1d: pool.feeApr1d,
        totalApr1d: pool.totalApr1d,
        incentiveApr: pool.incentiveApr,
        isIncentivized: pool.isIncentivized,
        wasIncentivized: pool.wasIncentivized,
        hasEnabledSteerVault: pool.hasSmartPool,
        hadEnabledSteerVault: pool.hadSmartPool,
      }
    }
  } catch (error) {
    console.error('getV4Pool error', error)
  }
  return null
}

export type RawV4Pool = NonNullable<Awaited<ReturnType<typeof getV4Pool>>>
export type V4Pool = Omit<RawV4Pool, 'token0' | 'token1'> & {
  token0: EvmCurrency
  token1: EvmCurrency
}

export function hydrateV4Pool(pool: RawV4Pool): V4Pool {
  return {
    ...pool,
    token0: hydratePoolCurrency(pool.token0),
    token1: hydratePoolCurrency(pool.token1),
  }
}
