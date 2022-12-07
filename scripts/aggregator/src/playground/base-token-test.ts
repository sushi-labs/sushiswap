// import { PrismaClient } from '@prisma/client'
// import {
//   DAI_ADDRESS,
//   FRAX_ADDRESS,
//   FXS_ADDRESS,
//   MIM_ADDRESS,
//   Native,
//   SUSHI_ADDRESS,
//   USDC_ADDRESS,
//   USDT_ADDRESS,
//   WBTC_ADDRESS,
//   WETH9_ADDRESS,
// } from '@sushiswap/currency'

// import { ChainId, chainName, chainShortName, chainShortNameToChainId } from '@sushiswap/chain'

// const prisma = new PrismaClient()

// async function main() {
//   const protocols = ['SushiSwap']
//   await getBaseCount(ChainId.ETHEREUM, 100, protocols)
//   // await getBaseCount(ChainId.ARBITRUM, 100, protocols)
//   // await getBaseCount(ChainId.POLYGON, 100, protocols)
//   // await getBaseCount(ChainId.AVALANCHE, 100, protocols)
// }

// async function getBaseCount(
//   chainId: ChainId.ARBITRUM | ChainId.ETHEREUM | ChainId.POLYGON | ChainId.AVALANCHE,
//   minimumLiquidity: number,
//   protocols: string[]
// ) {

//   const bases: string[] = []
//   if (USDC_ADDRESS[chainId]) bases.push(USDC_ADDRESS[chainId].toLowerCase())
//   if (Native.onChain(chainId).wrapped.address) bases.push(Native.onChain(chainId).wrapped.address.toLowerCase())
//   if (WETH9_ADDRESS[chainId]) bases.push(WETH9_ADDRESS[chainId].toLowerCase())
//   if (USDT_ADDRESS[chainId]) bases.push(USDT_ADDRESS[chainId].toLowerCase())
//   if (DAI_ADDRESS[chainId]) bases.push(DAI_ADDRESS[chainId].toLowerCase())
//   if (WBTC_ADDRESS[chainId]) bases.push(WBTC_ADDRESS[chainId].toLowerCase())
//   if (SUSHI_ADDRESS[chainId]) bases.push(SUSHI_ADDRESS[chainId].toLowerCase())
//   if (MIM_ADDRESS[chainId]) bases.push(MIM_ADDRESS[chainId].toLowerCase())
//   if (FRAX_ADDRESS[chainId]) bases.push(FRAX_ADDRESS[chainId].toLowerCase())
//   if (FXS_ADDRESS[chainId]) bases.push(FXS_ADDRESS[chainId].toLowerCase())

//   const include = {
//     pools0: {
//       where: {
//         AND: {
//           protocol: { in: protocols },
//           liquidityUSD: { gt: minimumLiquidity },
//         },
//       },
//     },
//     pools1: {
//       where: {
//         AND: {
//           protocol: { in: protocols },
//           liquidityUSD: { gt: minimumLiquidity },
//         },
//       },
//     },
//   }
//   const batch = 20000
//   const firstRequest = 
//       await prisma.token.findMany({
//         where: {
//           chainId: chainId.toString(),
//         },
//         include,
//         take: batch,
//       })
//     const results = [firstRequest]
    
//     let cursor = firstRequest[firstRequest.length - 1].id
//     let run = true
//     while (run) {
//      const cursorResponse = await prisma.token.findMany({
//         where: {
//           chainId: chainId.toString(),
//         },
//         cursor: {
//           id: cursor,
//         },
//         include,
//         skip: 1,
//         take: batch,
//       })
//       if (cursorResponse.length === batch) {
//         results.push(cursorResponse)
//         cursor = cursorResponse[cursorResponse.length - 1].id
//         console.log("new cursor", cursor)
//       } else {
//         console.log("stop running")
//         run = false
//       }
//     }

  
//   console.log(`Chain: ${chainShortName[chainId]}, minimumLiquidity: ${minimumLiquidity}`)

//   const mapped = results.flat()
//     .map((result) => {
//       const pools = [...result.pools0, ...result.pools1]
//       const totalLiquidity = pools.reduce((acc, pool) => acc + Number(pool.liquidityUSD), 0)
//       return {
//         address: result.address,
//         symbol: result.symbol,
//         poolCount: pools.length,
//         pools: pools,
//         totalLiquidity,
//       }
//     })

//     .sort((a, b) => b.totalLiquidity - a.totalLiquidity)

//   mapped.slice(0, 150).forEach((result) => {
//     let hasLoggedTokenLabel = false
//       if (!bases.includes(result.address)) {
//       for( const pool of result.pools) {
//         if (Number(pool.liquidityUSD) > 1000) {
//           const otherToken = pool.token0Id === result.address ? pool.token1Id : pool.token0Id
//           if (!bases.includes(otherToken)) {
//             if (!hasLoggedTokenLabel) { 
//               console.log(`Token: ${result.symbol} ${result.address}, pool count: ${result.poolCount}, totalLiquidity: ${result.totalLiquidity}`)

//               hasLoggedTokenLabel = true
//             }
//             console.log(`Pool: ${pool.name}, ${pool.address} liquidityUSD: ${pool.liquidityUSD}, otherToken: ${otherToken}`)
//           }
//         }
//       }
//     }

//   })

  
//   console.log('-----------------------')
// }

// // const exoticPairs = await prisma.pool.findMany({
// //   where: {
// //     AND: {

// //       token0Id: {
// //       in: base
// //       },
// //       token1Id: {
// //         in: base
// //         },
// //         chainId: ChainId.ARBITRUM.toString(),
// //         protocol: "SushiSwap",
// //         liquidityUSD: {
// //           gt: 100
// //         }
// //     }

// //   }
// //   ,
// //   include: {
// //     token0: true,
// //     token1: true
// //   }
// // })
// // console.log(exoticPairs.map((pair) => `${pair.token0.symbol}-${pair.token1.symbol}, liquidityUSD: ${pair.liquidityUSD}\n`))
// // InputToken, outputToken

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })
