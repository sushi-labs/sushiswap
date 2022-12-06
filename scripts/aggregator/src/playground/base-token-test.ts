import { PrismaClient } from '@prisma/client'
import {
  DAI_ADDRESS,
  FRAX_ADDRESS,
  FXS_ADDRESS,
  MIM_ADDRESS,
  Native,
  SUSHI_ADDRESS,
  USDC_ADDRESS,
  USDT_ADDRESS,
} from '@sushiswap/currency'

import { ChainId, chainName, chainShortName, chainShortNameToChainId } from '@sushiswap/chain'

const prisma = new PrismaClient()

async function main() {
    await getBaseCount(ChainId.ETHEREUM, 100)
    await getBaseCount(ChainId.ARBITRUM, 100)
    await getBaseCount(ChainId.POLYGON, 100)
  
}

async function getBaseCount(chainId: ChainId.ARBITRUM | ChainId.ETHEREUM | ChainId.POLYGON, minimumLiquidity: number) {
  // const bases = [
  //   USDC_ADDRESS[chainId],
  //   Native.onChain(chainId).wrapped.address,
  //   USDT_ADDRESS[chainId],
  //   DAI_ADDRESS[chainId],
  //   SUSHI_ADDRESS[chainId],
  //   MIM_ADDRESS[chainId],
  //   // FRAX_ADDRESS[chainId],
  //   // FXS_ADDRESS[chainId],
  // ]
  const bases: string[] = []
  if (USDC_ADDRESS[chainId]) bases.push(USDC_ADDRESS[chainId])
  if (Native.onChain(chainId).wrapped.address) bases.push(Native.onChain(chainId).wrapped.address)
  if (USDT_ADDRESS[chainId]) bases.push(USDT_ADDRESS[chainId])
  if (DAI_ADDRESS[chainId]) bases.push(DAI_ADDRESS[chainId])
  if (SUSHI_ADDRESS[chainId]) bases.push(SUSHI_ADDRESS[chainId])
  if (MIM_ADDRESS[chainId]) bases.push(MIM_ADDRESS[chainId])
  if (FRAX_ADDRESS[chainId]) bases.push(FRAX_ADDRESS[chainId])
  if (FXS_ADDRESS[chainId]) bases.push(FXS_ADDRESS[chainId])

  const request = bases.map((base) =>
    prisma.token.findFirst({
      where: {
        AND: {
          address: base.toLowerCase(),
          chainId: chainId.toString(),
        },
      },
      include: {
        pools0: {
          where: {
            liquidityUSD: { gt: minimumLiquidity },
          },
        },
        pools1: {
          where: {
            liquidityUSD: { gt: minimumLiquidity },
          },
        },
      },
    })
  )

  const results = await Promise.all(request)
  console.log(`Chain: ${chainShortName[chainId]}, minimumLiquidity: ${minimumLiquidity}`)
  results.forEach((result) => {
    if (!result) return
    const pools = [...result.pools0, ...result.pools1]
    console.log(`Token: ${result.symbol}, pool count: ${pools.length}`)
  })
  console.log('-----------------------')
}

// const exoticPairs = await prisma.pool.findMany({
//   where: {
//     AND: {

//       token0Id: {
//       in: base
//       },
//       token1Id: {
//         in: base
//         },
//         chainId: ChainId.ARBITRUM.toString(),
//         protocol: "SushiSwap",
//         liquidityUSD: {
//           gt: 100
//         }
//     }

//   }
//   ,
//   include: {
//     token0: true,
//     token1: true
//   }
// })
// console.log(exoticPairs.map((pair) => `${pair.token0.symbol}-${pair.token1.symbol}, liquidityUSD: ${pair.liquidityUSD}\n`))
// InputToken, outputToken

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
