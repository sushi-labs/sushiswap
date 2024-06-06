import {
  type DecimalToString,
  type Prisma,
  createClient,
} from '@sushiswap/database'
import type {
  SteerChainId,
  SteerVault,
  SteerVaultWithPool,
} from '@sushiswap/steer-sdk'
import type { SushiSwapV3ChainId } from 'sushi/config'
import type {
  Address,
  ID,
  PoolIfIncentivized,
  PoolSwapFee,
  PoolWithAprs,
  SushiSwapV3Protocol,
} from 'sushi/types'
import { type SteerVaultsApiSchema } from '../../pure/steer-vault/vaults/schema'
import { parseSteerArgs } from './parse'

type Vaults = SteerVaultWithPool<
  SteerVault,
  PoolWithAprs<PoolSwapFee<PoolIfIncentivized>>
>[]

export async function getSteerVaultsFromDB(
  args: typeof SteerVaultsApiSchema._output,
): Promise<Vaults> {
  const take = args.take
  const orderBy: Prisma.SteerVaultOrderByWithRelationInput = {
    [args.orderBy]: args.orderDir,
  }
  const where: Prisma.SteerVaultWhereInput = parseSteerArgs(args)

  let skip = 0
  let cursor: { cursor: Prisma.SteerVaultWhereUniqueInput } | object = {}

  if (args.cursor) {
    skip = 1
    cursor = { cursor: { id: args.cursor } }
  }

  const client = await createClient()
  const vaults = await client.steerVault.findMany({
    take,
    skip,
    ...cursor,
    where,
    orderBy,
    select: {
      id: true,
      address: true,
      chainId: true,

      pool: {
        select: {
          id: true,
          address: true,
          chainId: true,
          protocol: true,

          swapFee: true,

          incentiveApr: true,
          isIncentivized: true,
          wasIncentivized: true,

          feeApr1h: true,
          feeApr1d: true,
          feeApr1w: true,
          feeApr1m: true,

          totalApr1h: true,
          totalApr1d: true,
          totalApr1w: true,
          totalApr1m: true,
        },
      },
      feeTier: true,

      apr: true,
      apr1d: true,
      apr1w: true,
      // apr1m: true,
      // apr1y: true,

      token0: {
        select: {
          id: true,
          address: true,
          name: true,
          symbol: true,
          decimals: true,
        },
      },
      reserve0: true,
      reserve0USD: true,
      fees0: true,
      fees0USD: true,

      token1: {
        select: {
          id: true,
          address: true,
          name: true,
          symbol: true,
          decimals: true,
        },
      },
      reserve1: true,
      reserve1USD: true,
      fees1: true,
      fees1USD: true,

      reserveUSD: true,
      feesUSD: true,

      strategy: true,
      payloadHash: true,
      // description: true,
      // state: true

      performanceFee: true,

      lowerTick: true,
      upperTick: true,

      adjustmentFrequency: true,
      lastAdjustmentTimestamp: true,

      isEnabled: true,
      wasEnabled: true,
      isDeprecated: true,

      creator: true,
      admin: true,
      manager: true,
    },
  })

  const vaultsRetyped = vaults as unknown as DecimalToString<typeof vaults>
  const vaultsTransformed = vaultsRetyped.map<Vaults[number]>((vault) => ({
    id: vault.id as ID,
    address: vault.address as Address,
    chainId: vault.chainId as SteerChainId,

    pool: {
      id: vault.pool.id as ID,
      address: vault.pool.address as Address,
      chainId: vault.pool.chainId as SushiSwapV3ChainId,
      protocol: vault.pool.protocol as SushiSwapV3Protocol,

      incentiveApr: vault.pool.incentiveApr,
      isIncentivized: vault.pool.isIncentivized,
      wasIncentivized: vault.pool.wasIncentivized,

      feeApr1h: vault.pool.feeApr1h,
      feeApr1d: vault.pool.feeApr1d,
      feeApr1w: vault.pool.feeApr1w,
      feeApr1m: vault.pool.feeApr1m,

      totalApr1h: vault.pool.totalApr1h,
      totalApr1d: vault.pool.totalApr1d,
      totalApr1w: vault.pool.totalApr1w,
      totalApr1m: vault.pool.totalApr1m,

      swapFee: Number(vault.pool.swapFee),
    },

    feeTier: vault.feeTier,

    apr: Number(vault.apr),
    apr1d: Number(vault.apr1d),
    apr1w: Number(vault.apr1w),
    // apr1m: Number(vault.apr1m),
    // apr1y: Number(vault.apr1y),

    token0: {
      id: vault.token0.id as ID,
      address: vault.token0.address as Address,
      chainId: vault.pool.chainId as SushiSwapV3ChainId,
      name: vault.token0.name,
      symbol: vault.token0.symbol,
      decimals: vault.token0.decimals,
    },
    reserve0: BigInt(vault.reserve0),
    reserve0USD: Number(vault.reserve0USD),
    fees0: BigInt(vault.fees0),
    fees0USD: Number(vault.fees0USD),

    token1: {
      id: vault.token1.id as ID,
      address: vault.token1.address as Address,
      chainId: vault.pool.chainId as SushiSwapV3ChainId,
      name: vault.token1.name,
      symbol: vault.token1.symbol,
      decimals: vault.token1.decimals,
    },
    reserve1: BigInt(vault.reserve1),
    reserve1USD: Number(vault.reserve1USD),
    fees1: BigInt(vault.fees1),
    fees1USD: Number(vault.fees1USD),

    reserveUSD: Number(vault.reserveUSD),
    feesUSD: Number(vault.feesUSD),

    strategy: vault.strategy,
    payloadHash: vault.payloadHash,
    // description: vault.description,
    // state: vault.state

    performanceFee: vault.performanceFee,

    lowerTick: BigInt(vault.lowerTick),
    upperTick: BigInt(vault.upperTick),

    adjustmentFrequency: vault.adjustmentFrequency,
    lastAdjustmentTimestamp: vault.lastAdjustmentTimestamp,

    isEnabled: vault.isEnabled,
    wasEnabled: vault.wasEnabled,
    isDeprecated: vault.isDeprecated,

    creator: vault.creator,
    admin: vault.admin,
    manager: vault.manager,
  }))

  await client.$disconnect()
  return vaultsTransformed
}
