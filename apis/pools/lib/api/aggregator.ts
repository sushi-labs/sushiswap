// eslint-disable-next-line
import type * as _ from '@prisma/client/runtime'

import { DecimalToString, createClient, Prisma } from '@sushiswap/database'
import type { AggregatorPoolsByTokenIdsSchema, AggregatorTopPools } from './../schemas/index.js'

export async function getAggregatorTopPools(args: typeof AggregatorTopPools._output) {
  let where: Prisma.PoolWhereInput = {
    chainId: args.chainId,
    isWhitelisted: true,
    protocol: args.protocol,
    version: args.version,
    type: { in: args.poolTypes },
    token0: {
      isFeeOnTransfer: false,
    },
    token1: {
      isFeeOnTransfer: false,
    },
  }
  if (args.minLiquidity) {
    where = {
      liquidityUSD: {
        gte: args.minLiquidity,
      },
      ...where,
    }
  }

  const client = await createClient()
  const pools = await client.pool.findMany({
    where,
    take: args.take,
    orderBy: {
      liquidityUSD: 'desc',
    },
    select: {
      address: true,
      twapEnabled: true,
      swapFee: true,
      type: true,
      token0: {
        select: {
          id: true,
          address: true,
          name: true,
          symbol: true,
          decimals: true,
        },
      },
      token1: {
        select: {
          id: true,
          address: true,
          name: true,
          symbol: true,
          decimals: true,
        },
      },
    },
  })

  await client.$disconnect()
  return pools
}

export async function getAggregatorPoolsByTokenIds(args: typeof AggregatorPoolsByTokenIdsSchema._output) {
  const token0Id = `${args.chainId}:${args.token0}`
  const token1Id = `${args.chainId}:${args.token1}`

  let topPoolWhere: Prisma.PoolWhereInput = {
    chainId: args.chainId,
    isWhitelisted: true,
    protocol: args.protocol,
    version: args.version,
    type: { in: args.poolTypes },
  }
  if (args.topPoolMinLiquidity) {
    topPoolWhere = {
      liquidityUSD: {
        gte: args.topPoolMinLiquidity,
      },
      ...topPoolWhere,
    }
  }

  const select = {
    id: true,
    address: true,
    liquidityUSD: true,
    twapEnabled: true,
    swapFee: true,
    type: true,
    token0: {
      select: {
        id: true,
        address: true,
        name: true,
        symbol: true,
        decimals: true,
      },
    },
    token1: {
      select: {
        id: true,
        address: true,
        name: true,
        symbol: true,
        decimals: true,
      },
    },
  }

  const client = await createClient()
  const result = await Promise.all([
    client.token.findFirstOrThrow({
      include: {
        pools0: {
          where: {
            chainId: args.chainId,
            protocol: args.protocol,
            version: args.version,
            type: { in: args.poolTypes },
            OR: [
              {
                token0Id: token0Id,
                token0: {
                  isFeeOnTransfer: false,
                },
                token1: {
                  status: 'APPROVED',
                  isFeeOnTransfer: false,
                },
              },
              {
                token1Id: token0Id,
                token0: {
                  status: 'APPROVED',
                  isFeeOnTransfer: false,
                },
                token1: {
                  isFeeOnTransfer: false,
                },
              },
            ],
          },
          select,
        },
        pools1: {
          where: {
            chainId: args.chainId,
            protocol: args.protocol,
            version: args.version,
            type: { in: args.poolTypes },
            OR: [
              {
                token0Id: token0Id,
                token0: {
                  isFeeOnTransfer: false,
                },
                token1: {
                  status: 'APPROVED',
                  isFeeOnTransfer: false,
                },
              },
              {
                token1Id: token0Id,
                token0: {
                  status: 'APPROVED',
                  isFeeOnTransfer: false,
                },
                token1: {
                  isFeeOnTransfer: false,
                },
              },
            ],
          },
          select,
        },
      },
      where: {
        id: token0Id,
      },
    }),

    client.token.findFirstOrThrow({
      include: {
        pools0: {
          where: {
            chainId: args.chainId,
            protocol: args.protocol,
            version: args.version,
            type: { in: args.poolTypes },
            OR: [
              {
                token0Id: token1Id,
                token0: {
                  isFeeOnTransfer: false,
                },
                token1: {
                  status: 'APPROVED',
                  isFeeOnTransfer: false,
                },
              },
              {
                token1Id: token1Id,
                token0: {
                  status: 'APPROVED',
                  isFeeOnTransfer: false,
                },
                token1: {
                  isFeeOnTransfer: false,
                },
              },
            ],
          },
          select,
        },
        pools1: {
          where: {
            chainId: args.chainId,
            protocol: args.protocol,
            version: args.version,
            type: { in: args.poolTypes },
            OR: [
              {
                token0Id: token1Id,
                token0: {
                  isFeeOnTransfer: false,
                },
                token1: {
                  status: 'APPROVED',
                  isFeeOnTransfer: false,
                },
              },
              {
                token1Id: token1Id,
                token0: {
                  status: 'APPROVED',
                  isFeeOnTransfer: false,
                },
                token1: {
                  isFeeOnTransfer: false,
                },
              },
            ],
          },
          select,
        },
      },
      where: {
        id: token1Id,
      },
    }),
    client.pool.findMany({
      where: topPoolWhere,
      take: args.excludeTopPoolsSize,
      orderBy: {
        liquidityUSD: 'desc',
      },
      select: {
        id: true,
      },
    }),
  ])

  await client.$disconnect()

  let token0PoolSize = 0
  let token1PoolSize = 0
  const token0Pools = [result[0].pools0, result[0].pools1].flat()
  const token1Pools = [result[1].pools0, result[1].pools1].flat()
  // console.log(`Flattened pools, recieved: t0: ${token0Pools.length}, t1: ${token1Pools.length}`)

  const topPoolIds = result[2].map((p) => p.id)
  const filteredToken0Pools = token0Pools.filter((p) => !topPoolIds.includes(p.id))
  const filteredToken1Pools = token1Pools.filter((p) => !topPoolIds.includes(p.id))
  // console.log(`After excluding top pools: t0: ${filteredToken0Pools.length}, t1: ${filteredToken1Pools.length}`)

  if (filteredToken0Pools.length >= args.take / 2 && filteredToken1Pools.length >= args.take / 2) {
    token0PoolSize = args.take / 2
    token1PoolSize = args.take / 2
  } else if (filteredToken0Pools.length >= args.take / 2 && filteredToken1Pools.length < args.take / 2) {
    token1PoolSize = filteredToken1Pools.length
    token0PoolSize = args.take - filteredToken1Pools.length
  } else if (filteredToken1Pools.length >= args.take / 2 && filteredToken0Pools.length < args.take / 2) {
    token0PoolSize = filteredToken0Pools.length
    token1PoolSize = args.take - filteredToken0Pools.length
  } else {
    token0PoolSize = filteredToken0Pools.length
    token1PoolSize = filteredToken1Pools.length
  }

  const pools0 = filteredToken0Pools
    .sort((a, b) => Number(b.liquidityUSD) - Number(a.liquidityUSD))
    .slice(0, token0PoolSize)
  const pools1 = filteredToken1Pools
    .sort((a, b) => Number(b.liquidityUSD) - Number(a.liquidityUSD))
    .slice(0, token1PoolSize)

  const pools = [...pools0, ...pools1].flat()

  await client.$disconnect()
  return pools as unknown as DecimalToString<typeof pools>
}
