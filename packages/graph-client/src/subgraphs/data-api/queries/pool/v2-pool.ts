import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import {
  type ChefType,
  type EvmChainId,
  type EvmID,
  EvmToken,
  type PoolBase,
  type PoolHistory1D,
  type PoolV2,
  type PoolWithAprs,
  type PoolWithIncentives,
  type RewarderType,
  type SerializedEvmToken,
  SushiSwapProtocol,
  isSushiSwapV2ChainId,
} from 'sushi/evm'
import type { Address } from 'viem'
import { SUSHI_DATA_API_HOST } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const V2PoolQuery = graphql(
  `
   query V2Pool($address: Bytes!, $chainId: SushiSwapV2ChainId!) {
    v2Pool(address: $address, chainId: $chainId) {
      id
      chainId
      name
      address
      createdAt
      swapFee
      protocol
      token0 {
        id
        address
        name
        symbol
        decimals
      }
      token1 {
        id
        address
        name
        symbol
        decimals
      }
      source
      reserve0
      reserve1
      liquidity
      volumeUSD
      liquidityUSD
      token0Price
      token1Price
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
      incentives {
        id
        chainId
        chefType
        apr
        rewardToken {
          id
          address
          name
          symbol
          decimals
        }
        rewardPerDay
        poolAddress
        pid
        rewarderAddress
        rewarderType
      }
    }
  }
`,
)

export type GetV2Pool = VariablesOf<typeof V2PoolQuery>

export async function getV2Pool(
  variables: GetV2Pool,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  const chainId = Number(variables.chainId) as EvmChainId

  if (!isSushiSwapV2ChainId(chainId)) {
    throw new Error('Invalid chainId')
  }
  try {
    const result = await request(
      {
        url,
        document: V2PoolQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result.v2Pool) {
      const pool = result.v2Pool
      return {
        id: pool.id as EvmID,
        address: pool.address as Address,
        chainId,
        name: `${pool.token0.symbol}-${pool.token1.symbol}`,
        swapFee: pool.swapFee,
        protocol: SushiSwapProtocol.SUSHISWAP_V2,
        reserve0: BigInt(pool.reserve0),
        reserve1: BigInt(pool.reserve1),
        liquidity: BigInt(pool.liquidity),
        liquidityUSD: pool.liquidityUSD,

        volumeUSD: pool.volumeUSD,
        feesUSD: pool.volumeUSD * pool.swapFee,

        token0: {
          address: pool.token0.address as Address,
          chainId,
          decimals: pool.token0.decimals,
          name: pool.token0.name,
          symbol: pool.token0.symbol,
        } satisfies Omit<SerializedEvmToken, 'type' | 'metadata'>,
        token1: {
          address: pool.token1.address as Address,
          chainId,
          decimals: pool.token1.decimals,
          name: pool.token1.name,
          symbol: pool.token1.symbol,
        } satisfies Omit<SerializedEvmToken, 'type' | 'metadata'>,
        token0Price: pool.token0Price,
        token1Price: pool.token1Price,
        txCount: pool.txCount1d,

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

        incentives: pool.incentives.map((incentive) => ({
          id: incentive.id as EvmID,
          chainId,
          chefType: incentive.chefType as ChefType,
          apr: incentive.apr,
          rewardToken: {
            address: incentive.rewardToken.address as Address,
            chainId,
            decimals: incentive.rewardToken.decimals,
            name: incentive.rewardToken.name,
            symbol: incentive.rewardToken.symbol,
          } satisfies Omit<SerializedEvmToken, 'type' | 'metadata'>,
          rewardPerDay: incentive.rewardPerDay,
          poolAddress: incentive.poolAddress,
          pid: incentive.pid,
          rewarderAddress: incentive.rewarderAddress,
          rewarderType: incentive.rewarderType as RewarderType,
        })),
      }
    }
  } catch (error) {
    console.error('getV2Pool error', error)
  }
  return null
}

export type RawV2Pool = NonNullable<Awaited<ReturnType<typeof getV2Pool>>>
export type V2Pool = PoolWithAprs<
  PoolWithIncentives<PoolHistory1D<PoolV2<PoolBase>>>
>

export function hydrateV2Pool(pool: RawV2Pool | V2Pool) {
  if (pool.token0 instanceof EvmToken) {
    return pool as V2Pool
  }

  return {
    ...pool,
    token0: new EvmToken(pool.token0),
    token1: new EvmToken(pool.token1),
    incentives: pool.incentives.map((incentive) => ({
      ...incentive,
      rewardToken: new EvmToken(incentive.rewardToken),
    })),
  } satisfies V2Pool
}
