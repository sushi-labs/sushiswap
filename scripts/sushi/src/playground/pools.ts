import { PrismaClient } from '@prisma/client'
import { Native, USDC_ADDRESS } from '@sushiswap/currency'

import { ChainId } from '@sushiswap/chain'
import { performance } from 'perf_hooks'

const prisma = new PrismaClient()

async function main() {
  // const chainId = ChainId.POLYGON
  const chainId = ChainId.ETHEREUM
  const token = Native.onChain(chainId).wrapped
  const address = token.address.toLowerCase()
  // const address = USDC_ADDRESS[chainId].toLowerCase()
  const minimumLiquidity = 0

  const startTimePools = performance.now()
  const pools = await Promise.all([
    getPools(chainId, 'QuickSwap', 'V2', address ),//minimumLiquidity),
    getPools(chainId, 'SushiSwap', 'LEGACY', address ),//minimumLiquidity),
    getPools(chainId, 'SushiSwap', 'TRIDENT', address ),//minimumLiquidity),
    getPools(chainId, 'UniSwap', 'V2', address )//minimumLiquidity),
  ])
  const endTimePools = performance.now()
  console.log(`*** POOL REQUESTS completed after ${((endTimePools - startTimePools) / 1000).toFixed(1)} seconds. `)

  const startTimeBases = performance.now()
  const bases = await Promise.all([
    getBase(chainId, 'QuickSwap', 'V2', [address]),
    getBase(chainId, 'SushiSwap', 'LEGACY', [address]),
    getBase(chainId, 'SushiSwap', 'TRIDENT', [address]),
    getBase(chainId, 'UniSwap', 'V2', [address]),
  ])
  const endTimeBases = performance.now()
  console.log(`*** BASE REQUESTS completed after ${((endTimeBases - startTimeBases) / 1000).toFixed(1)} seconds. `)

  // console.log(`${token.symbol} POOLS FOR TRIDENT`)
  // if (pools[2]) {
  //   const tridentPools = pools[2].token.pools
  //   if (tridentPools) {
  //     for (const pool of tridentPools) {
  //       console.log(`${pool?.address} ${pool?.token.symbol}`)
  //     }
  //   }
  // }
  // console.log("BASES FOR TRIDENT")
  // for (const base of bases[2]) {
  //   console.log(`${base.token0.symbol}-${base.token1.symbol}`)
  // }
}

async function getPools(
  chainId: ChainId,
  protocol: string,
  version: string,
  address: string,
  // minimumLiquidity: number
) {
  const startTime = performance.now()
  const request = await prisma.token.findFirst({
    where: {
      chainId,
      address,
    },
    include: {
      pools0: {
        select: {
          address: true,
          type: true,
          twapEnabled: true,
          swapFee: true,
          token0: {
            select: {
              address: true,
              symbol: true,
              name: true,
              decimals: true,
            },
          },
          token1: {
            select: {
              address: true,
              symbol: true,
              name: true,
              decimals: true,
            },
          },
        },
        where: {
          protocol,
          version,
          // liquidityUSD: { gt: minimumLiquidity }, 
          OR: [
            {
              token1: {
                address: {
                  not: address,
                },
                status: 'APPROVED',
              },
            },

            {
              token0: {
                address: {
                  not: address,
                },
                status: 'APPROVED',
              },
            },
          ],
        },
      },
      pools1: {
        select: {
          address: true,
          type: true,
          twapEnabled: true,
          swapFee: true,
          token0: {
            select: {
              address: true,
              symbol: true,
              name: true,
              decimals: true,
            },
          },
          token1: {
            select: {
              address: true,
              symbol: true,
              name: true,
              decimals: true,
            },
          },
        },
        where: {
          protocol,
          version,
          // liquidityUSD: { gt: minimumLiquidity },
          OR: [
            {
              token1: {
                address: {
                  not: address,
                },
                status: 'APPROVED',
              },
            },

            {
              token0: {
                address: {
                  not: address,
                },
                status: 'APPROVED',
              },
            },
          ],
        },
      },
    },
  })
  const endTime = performance.now()
  console.log(
    `POOL REQUEST - ${protocol} ${version} pools fetched in ${((endTime - startTime) / 1000).toFixed(1)} seconds. `
  )

  if (!request) {
    console.log(`POOL REQUEST - ${protocol} ${version} no token found`)
    return
  }

  const pools = Array.from(
    new Set(
      [
        request.pools0.map((pool) => ({
          address: pool.address,
          type: pool.type,
          twapEnabled: pool.twapEnabled,
          swapFee: pool.swapFee,
          token: pool.token0.address.toLowerCase() === address.toString() ? pool.token1 : pool.token0,
        })),
        request.pools1.map((pool) => ({
          address: pool.address,
          type: pool.type,
          twapEnabled: pool.twapEnabled,
          swapFee: pool.swapFee,
          token: pool.token0.address.toLowerCase() === address.toString() ? pool.token1 : pool.token0,
        })),
        ,
      ].flat()
    )
  )
  console.log(`POOL REQUEST - ${protocol} ${version}, found ${pools.length} pools.`)

  return {
    token: {
      address: request.address,
      symbol: request.symbol,
      name: request.name,
      decimals: request.decimals,
      pools,
    },
  }
}

export async function getBase(
  chainId: ChainId,
  protocol: string,
  version: string,
  excludeTokens: string[],
  size: number = 100
) {
  const startTime = performance.now()
  const result = await prisma.pool.findMany({
    take: size,
    where: {
      chainId,
      protocol,
      version,
      AND: {
        token0: {
          address: {
            notIn: excludeTokens,
          },
          status: 'APPROVED',
        },
        token1: {
          address: {
            notIn: excludeTokens,
          },
          status: 'APPROVED',
        },
      } 
    },
    select: {
      address: true,
      type: true,
      twapEnabled: true,
      swapFee: true,
      token0: {
        select: {
          address: true,
          symbol: true,
          name: true,
          decimals: true,
        },
      },
      token1: {
        select: {
          address: true,
          symbol: true,
          name: true,
          decimals: true,
        },
      },
    },
    orderBy: {
      liquidityUSD: 'desc',
    },
  })
  const endTime = performance.now()
  console.log(
    `BASE REQUEST - ${protocol} ${version} pools fetched in ${((endTime - startTime) / 1000).toFixed(1)} seconds. `
  )

  console.log(`BASE REQUEST - ${protocol} ${version}, found ${result.length} pools.`)
  return result
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
