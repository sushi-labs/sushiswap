import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import {
  type ChefType,
  type EvmChainId,
  type EvmID,
  type RewarderType,
  SushiSwapProtocol,
  isSushiSwapV2ChainId,
} from 'sushi/evm'
import { type Address, getAddress } from 'viem'
import { SUSHI_DATA_API_HOST } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'

export const V2PositionsQuery = graphql(
  `
query V2PositionsQuery($user: Bytes!, $chainId: SushiSwapV2ChainId!) {
  v2LiquidityPositions(user: $user, chainId: $chainId) {
    user
    stakedBalance
    unstakedBalance
    pool {
      id
      chainId
      name
      address
      swapFee
      protocol

      liquidity
      liquidityUSD
      feeApr1d
      totalApr1d
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
    }
  }
}
`,
)

export type GetV2Positions = VariablesOf<typeof V2PositionsQuery>

export async function getV2Positions(
  variables: GetV2Positions,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  const chainId = Number(variables.chainId) as EvmChainId

  if (!isSushiSwapV2ChainId(chainId)) {
    throw new Error('Invalid chainId')
  }
  const user = getAddress(variables.user).toLowerCase() as Address

  const result = await request(
    { url, document: V2PositionsQuery, variables: { chainId, user } },
    options,
  )
  if (result.v2LiquidityPositions) {
    return result.v2LiquidityPositions.map((p) => {
      const incentives = p.pool.incentives
        .filter((i) => i !== null)
        .map((incentive) => ({
          id: incentive.id as EvmID,
          chainId,
          chefType: incentive.chefType as ChefType,
          apr: incentive.apr,
          rewardToken: {
            id: incentive.rewardToken.id as EvmID,
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
        }))

      const pool = {
        id: p.pool.id as EvmID,
        address: p.pool.address as Address,
        chainId,
        name: `${p.pool.token0.symbol}-${p.pool.token1.symbol}`,
        swapFee: p.pool.swapFee,
        protocol: SushiSwapProtocol.SUSHISWAP_V2,
        liquidity: BigInt(p.pool.liquidity),
        liquidityUSD: p.pool.liquidityUSD,

        token0: {
          id: p.pool.token0.id as EvmID,
          address: p.pool.token0.address as Address,
          chainId,
          decimals: p.pool.token0.decimals,
          name: p.pool.token0.name,
          symbol: p.pool.token0.symbol,
        },
        token1: {
          id: p.pool.token1.id as EvmID,
          address: p.pool.token1.address as Address,
          chainId,
          decimals: p.pool.token1.decimals,
          name: p.pool.token1.name,
          symbol: p.pool.token1.symbol,
        },

        feeApr1d: p.pool.feeApr1d,
        totalApr1d: p.pool.totalApr1d,
        incentiveApr: p.pool.incentiveApr,
        isIncentivized: p.pool.isIncentivized,
        wasIncentivized: p.pool.wasIncentivized,
        incentives,
      }
      return {
        user: p.user,
        stakedBalance: BigInt(p.stakedBalance),
        unstakedBalance: BigInt(p.unstakedBalance),
        pool,
      }
    })
  }

  throw new Error('No positions found')
}

export type V2Position = Awaited<ReturnType<typeof getV2Positions>>[0]
