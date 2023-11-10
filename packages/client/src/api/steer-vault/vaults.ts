import {
  type DecimalToString,
  type Prisma,
  createClient,
} from '@sushiswap/database'
import { type SteerVaultsApiSchema } from '../../pure/steer-vault/vaults/schema'
import { SushiPoolSelect } from '../pools/pools/select'
import { parseSteerArgs } from './parse'

export async function getSteerVaultsFromDB(
  args: typeof SteerVaultsApiSchema._output,
) {
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
        select: SushiPoolSelect,
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

      creator: true,
      admin: true,
      manager: true,
    },
  })

  const vaultsRetyped = vaults as unknown as DecimalToString<typeof vaults>

  await client.$disconnect()
  return vaultsRetyped
}
