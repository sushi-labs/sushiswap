import { PrismaClient } from '@prisma/client'
import { ChainId } from '@sushiswap/chain'

const prisma = new PrismaClient()

async function main() {
  const poolAddress = '0x001b6450083e531a5a7bf310bd2c1af4247e23d4'
  const results = await prisma.incentive.findMany({
    where: {
      apr: 0,
    },
    include: {
      pool: true,
      rewardToken: true,
    }
    // select: {
    //   id: true,
    //   pool: true,
    //   apr: true,
    // },
  })
  if (results) {
    results.forEach( result => {
      console.log(`incentive tokens: ${result.id} - ${result.pool.id} - ${result.apr}  ${result.rewardToken.symbol}`)

    })
  } else {
    console.log("no incentive found")
  }
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
