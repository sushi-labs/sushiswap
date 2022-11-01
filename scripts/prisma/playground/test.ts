import { PrismaClient } from '@prisma/client'
import { ChainId } from '@sushiswap/chain'

const prisma = new PrismaClient()

async function main() {
  const token = '0x6b175474e89094c44da98b954eedeac495271d0f'
  const result = await prisma.token.findFirst({
    where: {
      address: token,
      chainId: ChainId.ETHEREUM.toString(),
    },
    include: {
      pools0: true,
      pools1: true,
    },
  })
  if (result) {
  const pools = [
    result.pools0.map((pool) => (pool.address)),
    result.pools1.map((pool) => (pool.address))
  ].flat()
  const pairedWithTokens = [
    result.pools0.map((pool) => (pool.token0Id === token ? pool.token1Id : pool.token0Id)),
    result.pools1.map((pool) => (pool.token0Id === token ? pool.token1Id : pool.token0Id))
  ].flat()
  console.log(`token ${token}(${result.symbol}) is paired with ${pairedWithTokens.length} other tokens`)
  console.log('------')
  console.log(`Pools: ${pools.join(', ')}`)
  console.log('------')
  console.log(`Paired with the following tokens: ${pairedWithTokens.join(', ')}`)
  } else {
    console.log("no token found")
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
