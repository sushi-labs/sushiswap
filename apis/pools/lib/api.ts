import prisma from '@sushiswap/earn-database'

export async function getPool(chainId: number, address: string) {
  const id = `${chainId}:${address.toLowerCase()}`
  const pool = await prisma.pool.findFirstOrThrow({
    include: {
      token0: true,
      token1: true,
      incentives: true,
    },
    where: {
      id,
    },
  })
  await prisma.$disconnect()
  return pool
}

export async function getPools(args: PoolApiArgs): Promise<any[]> {
  const where = {
    chainId: {},
  }
  if (args.chains) {
    where.chainId = {
      in: args.chains,
    }
  }

  const pools = await prisma.pool.findMany({
    take: 20,
    // cursor: args.cursor,
    // skip: args.cursor ? 1 : undefined,
    // include: {
    //   token0: true,
    //   token1: true,
    //   incentives: true,
    // },
    select: {
      // TODO: fix package, this should be possible?
      id: true,
      address: true,
      name: true,
      chainId: true,
      version: true,
      type: true,
      swapFee: true,
      twapEnabled: true,
      liquidityUSD: true,
      volumeUSD: true,
      apr: true,
      totalApr: true,
      isIncentivized: true,
      volume1d: true,
      fees1d: true,
      volume1w: true,
      fees1w: true,
      isBlacklisted: true,
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
      incentives: {
        select: {
          id: true,
          chainId: true,
          type: true,
          rewardToken: {
            select: {
              id: true,
              address: true,
              name: true,
              symbol: true,
              decimals: true,
            },
          },
        },
      },
    },
  })
  await prisma.$disconnect()
  return pools ? pools : []
}

export type PoolApiArgs = {
  chains?: string[]
  poolTypes?: string[]
  farmsOnly?: boolean
  cursor?: string
  sort?: { [key: string]: 'asc' | 'desc' }
}
