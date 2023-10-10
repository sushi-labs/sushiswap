// eslint-disable-next-line
import type * as _ from '@prisma/client/runtime'

import { DecimalToString, Prisma, PrismaClient } from '@sushiswap/database'

import { z } from 'zod'

const AllPools = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  version: z.string(),
  protocol: z.string(),
  poolTypes: z.string().transform((poolTypes) => poolTypes?.split(',')),
})

const DiscoverNewPools = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  version: z.string(),
  protocol: z.string(),
  poolTypes: z.string().transform((poolTypes) => poolTypes?.split(',')),
  date: z.string().transform((date) => new Date(date)),
})

const SELECT = {
  id: true,
  address: true,
  twapEnabled: true,
  isWhitelisted: true,
  swapFee: true,
  type: true,
  liquidityUSD: true,
  token0: {
    select: {
      id: true,
      address: true,
      status: true,
      name: true,
      symbol: true,
      decimals: true,
      isFeeOnTransfer: true,
      isCommon: true,
    },
  },
  token1: {
    select: {
      id: true,
      address: true,
      name: true,
      status: true,
      symbol: true,
      decimals: true,
      isFeeOnTransfer: true,
      isCommon: true,
    },
  },
}

export async function getAllPools(
  client: PrismaClient,
  args: typeof AllPools._output,
) {
  try {
    const where: Prisma.PoolWhereInput = {
      chainId: args.chainId,
      protocol: args.protocol,
    }

    const batchSize = 1000
    let cursor = null
    const results = []
    let totalCount = 0
    do {
      let result = []
      if (!cursor) {
        result = await getPoolsPagination(client, where, batchSize)
      } else {
        result = await getPoolsPagination(client, where, batchSize, 1, {
          id: cursor,
        })
      }
      cursor =
        result.length === batchSize ? result[result.length - 1]?.id : null
      totalCount += result.length

      results.push(result)
      // console.debug(
      //   `${args.chainId}-${args.protocol}-${args.version} Fetched a batch of pools with ${result.length}
      //    cursor: ${cursor}, total: ${totalCount}.`
      // )
    } while (cursor != null)
    const flatResult = results.flat()
    //console.debug(`${args.chainId}-${args.protocol}-${args.version} Fetched ${flatResult.length}`)

    await client.$disconnect()
    return flatResult as unknown as DecimalToString<typeof flatResult>
  } catch (e: any) {
    console.error(e.message)
    await client.$disconnect()
    return []
  }
}

async function getPoolsPagination(
  client: PrismaClient,
  where: Prisma.PoolWhereInput,
  take: number,
  skip?: number,
  cursor?: Prisma.PoolWhereUniqueInput,
) {
  const pools = await client.pool.findMany({
    where,
    orderBy: [
      {
        liquidityUSD: 'desc',
      },
      {
        id: 'desc',
      },
    ],
    take,
    skip,
    cursor,
    select: SELECT,
  })
  return pools as unknown as DecimalToString<typeof pools>
}

export async function getNewPools(
  client: PrismaClient,
  args: typeof DiscoverNewPools._output,
) {
  const where: Prisma.PoolWhereInput = {
    chainId: args.chainId,
    protocol: args.protocol,
    generatedAt: {
      gt: args.date,
    },
  }
  const pools = await client.pool.findMany({
    where,
    select: SELECT,
  })
  return pools as unknown as DecimalToString<typeof pools>
}
