// eslint-disable-next-line
import type * as _ from '@prisma/client/runtime'
import { SushiPoolSelect } from '@sushiswap/pools-api/lib/api/select'

import { createClient, Prisma, type DecimalToString } from '@sushiswap/database'
import { deepmergeInto } from 'deepmerge-ts'
import type { SteerVaultApiSchema, SteerVaultCountApiSchema, SteerVaultsApiSchema } from './../schemas'

function parseWhere(args: typeof SteerVaultsApiSchema._output | typeof SteerVaultCountApiSchema._output) {
  const where: NonNullable<Prisma.SteerVaultWhereInput> = {}

  const addFilter = (filter: typeof where) => deepmergeInto(where, filter)

  if ('ids' in args && args.ids !== undefined) {
    addFilter({
      id: {
        in: args.ids,
      },
    })
  }

  // if ('chainIds' in args && args.chainIds !== undefined) {
  //   addFilter({
  //     chainId: { in: args.chainIds },
  //   })
  // }

  if ('isEnabled' in args && args.isEnabled !== undefined) {
    addFilter({
      isEnabled: args.isEnabled,
    })
  }

  return where
}

export async function getSteerVault(args: typeof SteerVaultApiSchema._output) {
  const id = `${args.chainId}:${args.address.toLowerCase()}`

  // Need to specify take, orderBy and orderDir to make TS happy
  const [vault]: Awaited<ReturnType<typeof getSteerVaults>> = await getSteerVaults({
    ids: [id],
    take: 1,
    orderBy: 'liquidityUSD',
    orderDir: 'desc',
  })

  if (!vault) throw new Error('Pool not found.')

  return vault
}

export async function getSteerVaults(args: typeof SteerVaultsApiSchema._output) {
  const take = args.take
  const orderBy: Prisma.SteerVaultOrderByWithRelationInput = { [args.orderBy]: args.orderDir }
  const where: Prisma.SteerVaultWhereInput = parseWhere(args)

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

      pool: {
        select: SushiPoolSelect,
      },
      feeTier: true,

      apr: true,
      // apr1d: true, currently unusable
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
      fees0: true,

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
      fees1: true,

      strategy: true,
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

export async function getSteerVaultCount(args: typeof SteerVaultCountApiSchema._output) {
  const where: Prisma.SteerVaultWhereInput = parseWhere(args)

  const client = await createClient()
  const count = await client.steerVault.count({
    where,
  })

  await client.$disconnect()
  return { count }
}
