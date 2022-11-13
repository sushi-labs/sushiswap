import { PrismaClient } from '@prisma/client'
import { ChainId } from '@sushiswap/chain'

const prisma = new PrismaClient()

async function main() {
  const prices = await prisma.token.count({
    where: {
      usdPrice: {
        gt: 0,
      }
    },
  })
  // console.log(`All prices for tokens with symbol SUSHI:`)
  // prices.forEach((result) => {
  //   if (Number(result.usdPrice) > 0) {
  //   console.log(` ${result.address} ${result.network} ${result.usdPrice}`)
  //   }
  // })
  console.log(`Total number of tokens with usdPrice > 0: ${prices}`)
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
