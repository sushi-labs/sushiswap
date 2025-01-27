import type { VariablesOf } from 'gql.tada'

import type { PoolHasSteerVaults } from '@sushiswap/steer-sdk'
import { request, type RequestOptions } from 'src/lib/request.js'
import {
  EvmChainId,
  ChefType,
  RewarderType,
  SushiSwapProtocol,
  type PoolBase,
  type PoolHistory1D,
  type PoolV3,
  type PoolWithAprs,
  type PoolWithIncentives,
} from 'sushi'
import { isSushiSwapV3ChainId } from 'sushi/config'
import { SUSHI_DATA_API_HOST } from '../../data-api-host.js'
import type { Address } from 'viem'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const V3PoolQuery = graphql(
  `
  query V3Pool($address: Bytes!, $chainId: SushiSwapV3ChainId!) {
    v3Pool(address: $address, chainId: $chainId) {
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
      sqrtPrice
      tick
      observationIndex
      feeGrowthGlobal0X128
      feeGrowthGlobal1X128
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
      hadSmartPool
      hasSmartPool
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
      vaults
    }
  }
`,
)

export type GetV3Pool = VariablesOf<typeof V3PoolQuery>

export async function getV3Pool(
  variables: GetV3Pool,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  const chainId = Number(variables.chainId) as EvmChainId

  if (!isSushiSwapV3ChainId(chainId)) {
    throw new Error('Invalid chainId')
  }
  try {
    const result = await request(
      {
        url,
        document: V3PoolQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result.v3Pool) {
      const incentives = result.v3Pool.incentives.filter((i) => i !== null)
      const pool = result.v3Pool
      return {
        id: pool.id as `${string}:0x${string}`,
        address: pool.address as Address,
        chainId,
        name: `${pool.token0.symbol}-${pool.token1.symbol}`,
        swapFee: pool.swapFee,
        protocol: SushiSwapProtocol.SUSHISWAP_V3,
        reserve0: BigInt(pool.reserve0),
        reserve1: BigInt(pool.reserve1),
        liquidity: BigInt(pool.liquidity),

        sqrtPrice: BigInt(pool.sqrtPrice),
        tick: BigInt(pool.tick),
        observationIndex: BigInt(pool.observationIndex),
        feeGrowthGlobal0X128: BigInt(pool.feeGrowthGlobal0X128),
        feeGrowthGlobal1X128: BigInt(pool.feeGrowthGlobal1X128),

        liquidityUSD: pool.liquidityUSD,
        volumeUSD: pool.volumeUSD,
        feesUSD: pool.volumeUSD * pool.swapFee,

        token0: {
          id: pool.token0.id as `${string}:0x${string}`,
          address: pool.token0.address as Address,
          chainId,
          decimals: pool.token0.decimals,
          name: pool.token0.name,
          symbol: pool.token0.symbol,
        },
        token1: {
          id: pool.token1.id as `${string}:0x${string}`,
          address: pool.token1.address as Address,
          chainId,
          decimals: pool.token1.decimals,
          name: pool.token1.name,
          symbol: pool.token1.symbol,
        },
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
        hasEnabledSteerVault: pool.hasSmartPool,
        hadEnabledSteerVault: pool.hadSmartPool,

        incentives: incentives.map((incentive) => ({
          id: incentive.id as `${string}:0x${string}`,
          chainId,
          chefType: incentive.chefType as ChefType,
          apr: incentive.apr,
          rewardToken: {
            id: incentive.rewardToken.id as `${string}:0x${string}`,
            address: incentive.rewardToken.address as Address,
            chainId,
            decimals: incentive.rewardToken.decimals,
            name: incentive.rewardToken.name,
            symbol: incentive.rewardToken.symbol,
          },
          rewardPerDay: incentive.rewardPerDay,
          poolAddress: incentive.poolAddress as Address,
          pid: incentive.pid,
          rewarderAddress: incentive.rewarderAddress as Address,
          rewarderType: incentive.rewarderType as RewarderType,
        })),
      } satisfies PoolHasSteerVaults<
        PoolWithAprs<PoolWithIncentives<PoolHistory1D<PoolV3<PoolBase>>>>
      >
    }
  } catch (error) {
    console.error('getV3Pool error', error)
  }
  return null
}

export type MaybeV3Pool = Awaited<ReturnType<typeof getV3Pool>>

export type V3Pool = NonNullable<Awaited<ReturnType<typeof getV3Pool>>>
