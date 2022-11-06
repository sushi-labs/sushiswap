import { PrismaClient } from '@prisma/client'
import { ChainId } from '@sushiswap/chain'

const prisma = new PrismaClient()

async function main() {
  await pools()
  await poolsWithIncentives()
  await incentivizedPools()
}

async function pools() {
  const poolsWithoutIncentives = await prisma.pool.findMany({
    where: {
      incentives: {
        none: {
        }
      }
    },
    orderBy: {
      totalApr: 'desc'
    },
    take: 40
  }
  )

  console.log("WTIHOUT INCENTIVES")
  poolsWithoutIncentives.forEach( result => {
    console.log(` ${result.name}  ${result.isIncentivized} - TOTAL APR: ${((result.totalApr ?? 0) * 100).toFixed(2)}%`)
  })
}

async function poolsWithIncentives() {
  const poolsWithIncentives = await prisma.pool.findMany({
    where: {
      incentives: {
        some: {
        }
      }
    },
    include: { 
      incentives: {
        include: {
        rewardToken: true
        },
      }
    },
    orderBy: {
      totalApr: 'desc'
    },
    take: 10
  }
  )
  console.log("WTIH INCENTIVES")
  poolsWithIncentives.forEach( result => {
    console.log(` ${result.id} ${result.name} ${result.isIncentivized} - TOTAL APR: ${((result.totalApr ?? 0) * 100).toFixed(2)}%`)
  })
  console.log("results: ", poolsWithIncentives.length)

}


async function incentivizedPools() {
  const poolsWithIncentives = await prisma.pool.findMany({
    where: {
      isIncentivized: true
    },
    include: { 
      incentives: {
        include: {
        rewardToken: true
        },
      }
    },
    orderBy: {
      totalApr: 'desc'
    },
    take: 10
  }
  )
  console.log("INCENTIVIZED POOLS")
  poolsWithIncentives.forEach( result => {
    console.log(`${result.name} - TOTAL APR: ${((result.totalApr ?? 0) * 100).toFixed(2)}%`)
  })
  console.log("results: ", poolsWithIncentives.length)

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
