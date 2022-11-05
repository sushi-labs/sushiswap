import { PrismaClient } from '@prisma/client'
import { ChainId } from '@sushiswap/chain'

const prisma = new PrismaClient()

async function main() {
  // const poolAddress = '0x001b6450083e531a5a7bf310bd2c1af4247e23d4'
  // const results = await prisma.incentive.findMany({
  //   // where: {
  //     // id: "0x06da0fd433c1a5d7a4faa01111c044910a184553"
  //   // },
  //   include: {
  //     // token0: true,
  //     pool: true,
  //     rewardToken: true,
  //   },
  //   // select: {
  //     // id: true,
  //   //   pool: true,
  //   //   apr: true,
  //   // },
  // })
  // if (results) {
  //   results.forEach( result => {
  //     // console.log({result})
  //     // console.log(`incentive tokens: ${result.id} -  ${result.pool.id}  ${result.rewardToken.symbol}`)

  //   })
  //   console.log("results: ", results.length)
  // } else {
  //   console.log("no incentive found")
  // }


  // const results = await prisma.pool.count({
  //   where: {
  //     chainId: ChainId.ETHEREUM.toString(),
  //   },
  //   // include: {
  //   //   // token0: true,
  //   //   pool: true,
  //   //   rewardToken: true,
  //   // },
  //   // select: {
  //     // id: true,
  //   //   pool: true,
  //   //   apr: true,
  //   // },
  // })
  // console.log("results: ", results)

  
  const results = await prisma.pool.findMany({
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
  })
  results.forEach( result => {
    console.log(`${result.name} - Pool APR: ${result.apr}`)
    if (result.incentives.length != 0) {
      console.log(`Farm APR: ${result.incentives.map( i => `${i.rewardToken.symbol} ${i.apr}`).join(', ')}`)
    }
    console.log(``)
  })
  console.log("results: ", results.length)
  
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
