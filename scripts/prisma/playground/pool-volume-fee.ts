import { PrismaClient } from '@prisma/client'
import { ChainId } from '@sushiswap/chain'

const prisma = new PrismaClient()

async function main() {
  const token = '0x6b175474e89094c44da98b954eedeac495271d0f'
  const result = await prisma.pool.findMany({
    where: {
      protocol: 'SushiSwap',
      fees1d: {
        gt: 0,
      }
    },
    select: {
      fees1d: true,
    }
  })
  const totalFees24h = result.reduce((acc, cur) => acc + Number(cur.fees1d), 0)
  const feesToBar = totalFees24h / 6
  console.log(`Total fees 24h: ${totalFees24h}`)
  console.log(`Total fees to bar: ${feesToBar}`)
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
