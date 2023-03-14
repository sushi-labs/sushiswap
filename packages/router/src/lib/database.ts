// eslint-disable-next-line
import type * as _ from '@prisma/client/runtime'

import { DecimalToString, Prisma, PrismaClient } from '@sushiswap/database'
import { performance } from 'perf_hooks'
import type { PoolType } from '@sushiswap/database'
import { z } from 'zod'

export const AllPools = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  protocol: z.string(),
  version: z.string(),
  poolTypes: z.string().transform((poolTypes) => poolTypes?.split(',') as PoolType[]),
})

export async function getAllPools(client: PrismaClient, args: typeof AllPools._output) {
  try {
    const where: Prisma.PoolWhereInput = {
      chainId: args.chainId,
      protocol: args.protocol,
      version: args.version,
      type: { in: args.poolTypes },
    }
    const startTime = performance.now()

    const batchSize = 1000
    let cursor = null
    const results = []
    let totalCount = 0
    do {
      const requestStartTime = performance.now()
      let result = []
      if (!cursor) {
        result = await getPoolsPagination(client, where, batchSize)
      } else {
        result = await getPoolsPagination(client, where, batchSize, 1, { id: cursor })
      }
      const requestEndTime = performance.now()

      cursor = result.length == batchSize ? result[result.length - 1]?.id : null
      totalCount += result.length

      results.push(result)
      const duration = ((requestEndTime - requestStartTime) / 1000).toFixed(1)
      console.debug(
        `${args.chainId}-${args.protocol}-${args.version} Fetched a batch of pools with ${result.length} 
         cursor: ${cursor}, total: ${totalCount} (${duration}s).`
      )
    } while (cursor != null)
    const endTime = performance.now()
    const flatResult = results.flat()
    const totalDuration = ((endTime - startTime) / 1000).toFixed(1)
    console.debug(`${args.chainId}-${args.protocol}-${args.version} Fetched ${flatResult.length} (${totalDuration}s).`)

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
  cursor?: Prisma.PoolWhereUniqueInput
) {
  const select =
    // Prisma.validator<Prisma.PoolSelect>()(
    {
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
  // )

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
    select,
  })
  return pools as unknown as DecimalToString<typeof pools>
}
