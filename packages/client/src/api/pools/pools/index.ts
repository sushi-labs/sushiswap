import {
  type DecimalToString,
  type Incentive as DbIncentive,
  type Prisma,
  Protocol,
  createClient,
} from '@sushiswap/database'
import { isPromiseFulfilled } from 'sushi/validate'

import type { PoolWithSteerVaults, SteerChainId } from '@sushiswap/steer-sdk'
import { withoutScientificNotation } from 'sushi'
import type { ChainId } from 'sushi/chain'
import {
  type Address,
  ChefType,
  type ID,
  type PoolBase,
  type PoolHistory,
  type PoolWithAprs,
  type PoolWithIncentives,
  RewarderType,
  SushiSwapProtocol,
} from 'sushi/types'
import { type PoolsApiSchema } from '../../../pure/pools/pools/schema'
import { parsePoolArgs } from '../parse'
import { SushiPoolSelect } from './select'

type Pools = PoolWithSteerVaults<
  PoolWithAprs<PoolWithIncentives<PoolHistory<PoolBase>>>
>[]

function translateProtocol(protocol: Protocol): SushiSwapProtocol {
  switch (protocol) {
    case Protocol.SUSHISWAP_V2:
      return SushiSwapProtocol.SUSHISWAP_V2
    case Protocol.SUSHISWAP_V3:
      return SushiSwapProtocol.SUSHISWAP_V3
    default:
      throw new Error(`Unknown protocol: ${protocol}`)
  }
}

function translateRewarderType(type: DbIncentive['rewarderType']) {
  switch (type) {
    case 'Primary':
      return RewarderType.Primary
    case 'Secondary':
      return RewarderType.Secondary
    default:
      throw new Error(`Unknown rewarder type: ${type}`)
  }
}

function translateChefType(type: DbIncentive['chefType']) {
  switch (type) {
    case 'MasterChefV1':
      return ChefType.MasterChefV1
    case 'MasterChefV2':
      return ChefType.MasterChefV2
    case 'MiniChef':
      return ChefType.MiniChef
    case 'Merkl':
      return ChefType.Merkl
    default:
      throw new Error(`Unknown chef type: ${type}`)
  }
}

export async function getPoolsFromDB(
  args: typeof PoolsApiSchema._output,
): Promise<Pools> {
  const take = args.take
  const orderBy: Prisma.SushiPoolOrderByWithRelationInput = {
    [args.orderBy]: args.orderDir,
  }
  const where: Prisma.SushiPoolWhereInput = parsePoolArgs(args)

  let skip = 0
  let cursor: { cursor: Prisma.SushiPoolWhereUniqueInput } | object = {}

  if (args.cursor) {
    skip = 1
    cursor = { cursor: { id: args.cursor } }
  }

  const client = await createClient()
  const pools = await client.sushiPool.findMany({
    take,
    skip,
    ...cursor,
    where,
    orderBy,
    select: SushiPoolSelect,
  })

  const poolsRetyped = pools as unknown as DecimalToString<typeof pools>
  const poolsTransformed = poolsRetyped.map<Pools[number]>((pool) => {
    return {
      id: pool.id as ID,
      address: pool.address as Address,
      chainId: pool.chainId as ChainId,
      name: pool.name,

      swapFee: Number(pool.swapFee),

      token0: {
        ...pool.token0,
        id: pool.token0.id as ID,
        address: pool.token0.address as Address,
        chainId: pool.chainId as ChainId,
      },
      token1: {
        ...pool.token1,
        id: pool.token1.id as ID,
        address: pool.token1.address as Address,
        chainId: pool.chainId as ChainId,
      },

      txCount: 0,
      txCount1d: 0,
      txCount1dChange: 0,
      txCount1w: 0,
      txCount1wChange: 0,
      txCount1m: 0,
      txCount1mChange: 0,

      feesUSD: Number(pool.feesUSD),
      feesUSD1d: Number(pool.fees1d),
      feesUSD1dChange: pool.feesChange1d,
      feesUSD1w: Number(pool.fees1w),
      feesUSD1wChange: pool.feesChange1w,
      feesUSD1m: Number(pool.fees1m),
      feesUSD1mChange: pool.feesChange1m,

      volumeUSD: Number(pool.volumeUSD),
      volumeUSD1d: Number(pool.volume1d),
      volumeUSD1dChange: pool.volumeChange1d,
      volumeUSD1w: Number(pool.volume1w),
      volumeUSD1wChange: pool.volumeChange1w,
      volumeUSD1m: Number(pool.volume1m),
      volumeUSD1mChange: pool.volumeChange1m,

      reserve0: BigInt(withoutScientificNotation(pool.reserve0)!),
      reserve1: BigInt(withoutScientificNotation(pool.reserve1)!),
      liquidity: BigInt(withoutScientificNotation(pool.totalSupply)!),

      liquidityUSD: Number(pool.liquidityUSD),
      liquidityUSD1d:
        Number(pool.liquidityUSD) +
        pool.liquidityUSDChange1d * Number(pool.liquidityUSD),
      liquidityUSD1dChange: pool.liquidityUSDChange1d,
      liquidityUSD1wChange: pool.liquidityUSDChange1w,
      liquidityUSD1mChange: pool.liquidityUSDChange1m,

      protocol: translateProtocol(pool.protocol),

      incentiveApr: pool.incentiveApr,
      incentives: pool.incentives.map((incentive) => ({
        ...incentive,
        id: incentive.id as ID,
        rewarderAddress: incentive.rewarderAddress as Address,
        rewarderType: translateRewarderType(incentive.rewarderType),
        chefType: translateChefType(incentive.chefType),
        chainId: pool.chainId as ChainId,
        rewardToken: {
          ...incentive.rewardToken,
          id: incentive.rewardToken.id as ID,
          address: incentive.rewardToken.address as Address,
          chainId: pool.chainId as ChainId,
        },
      })),
      isIncentivized: pool.isIncentivized,
      wasIncentivized: pool.wasIncentivized,

      hasEnabledSteerVault: pool.hasEnabledSteerVault,
      hadEnabledSteerVault: pool.hadEnabledSteerVault,
      steerVaults: pool.steerVaults.map((steerVault) => ({
        ...steerVault,
        id: steerVault.id as ID,
        address: steerVault.address as Address,
        chainId: pool.chainId as SteerChainId,
      })),

      feeApr1h: pool.feeApr1h,
      feeApr1d: pool.feeApr1d,
      feeApr1w: pool.feeApr1w,
      feeApr1m: pool.feeApr1m,

      totalApr1h: pool.totalApr1h,
      totalApr1d: pool.totalApr1d,
      totalApr1w: pool.totalApr1w,
      totalApr1m: pool.totalApr1m,
      token0Price: Number(pool.token0Price),
      token1Price: Number(pool.token1Price),
    }
  })

  if (args.ids && args.ids.length > poolsTransformed.length) {
    const fetchedPoolIds = poolsTransformed.map((pool) => pool.id)
    const unfetchedPoolIds = args.ids.filter(
      (id) => !fetchedPoolIds.includes(id),
    )

    const { getUnindexedPool } = await import('../unindexedPool')

    const unindexedPoolsResults = await Promise.allSettled(
      unfetchedPoolIds.map((id) => getUnindexedPool(id)),
    )
    const unindexedPools = unindexedPoolsResults.flatMap((res) =>
      isPromiseFulfilled(res) ? [res.value] : [],
    )

    poolsTransformed.push(...unindexedPools)
  }

  await client.$disconnect()
  return poolsTransformed
}
