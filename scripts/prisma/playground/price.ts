import { PrismaClient } from '@prisma/client'
import { ChainId } from '@sushiswap/chain'

const prisma = new PrismaClient()

async function main() {
  const prices = await prisma.token.findMany({
    where: {
      symbol: 'SUSHI',
    },
    include: {
      price: true,
    },
  })
  console.log(`All prices for tokens with symbol SUSHI:`)
  prices.forEach((result) => {
    if (Number(result.price?.usd) > 0) {
    console.log(` ${result.address} ${result.network} ${result.price?.usd}`)
    }
  })
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
