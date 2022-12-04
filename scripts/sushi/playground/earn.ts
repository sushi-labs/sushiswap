import { Prisma, PrismaClient } from '@prisma/client'
import { ChainId } from '@sushiswap/chain'
import { sortOrder } from 'sort-package-json'

const prisma = new PrismaClient()

async function main() {
  const result = await getPools()
  console.log('EARN PAGE')
  console.log('NETWORK~NAME~TVL~FEE(24h)~FEES(1W)~VOLUME(1w)~APR')

  result.forEach((result) => {
    console.log(
      `${result.name}~${result.liquidityUSD.toFixed(2)}~${result.fees1d?.toFixed(2)}~${result.fees1w?.toFixed(2)}~${result.volume1w}~${((result.totalApr ?? 0) * 100).toFixed(2)}%`
    )
  })

  const cursor = result[result.length - 1].id
  const nextResult = await getPools(cursor)

  console.log('NEXT PAGE')
  nextResult.forEach((result) => {
    console.log(
      `~${result.name}~${result.liquidityUSD.toFixed(2)}~${result.fees1d?.toFixed(2)}~${result.fees1w?.toFixed(2)}~${result.volume1w}~${((result.totalApr ?? 0) * 100).toFixed(2)}%`
    )
  })
}

async function getPools(cursor?: string) {
  const args: Prisma.PoolFindManyArgs = {
    take: 10,
    include: {
      incentives: {
        include: {
          rewardToken: true,
        },
      },
      token0: true,
      token1: true,
    },
    orderBy: {
      liquidityUSD: 'desc',
    },
  }

  if (cursor) {
    args.cursor = { id: cursor }
  }

  return await prisma.pool.findMany(args)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
