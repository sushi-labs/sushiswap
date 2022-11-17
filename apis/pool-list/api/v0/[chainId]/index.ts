import type { VercelRequest, VercelResponse } from '@vercel/node'
import prisma from '../../../lib/prisma'

export default async (request: VercelRequest, response: VercelResponse) => {
  const chainId = request.query.chainId as string
  const tokenAddress = request.query.token as string

  if (tokenAddress === undefined) {
    response.status(400).json({ message: 'No token argument provided.' })
  }
  const PROTOCOL = 'SushiSwap' // Hardcoded for now, should be a string array param?

  const tokenWithPools = await prisma.token.findFirst({
    where: {
      address: tokenAddress,
      chainId: chainId.toString(),
    },
    include: {
      pools0: {
        select: {
          address: true,
          protocol: true,
          type: true,
          version: true,
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
          liquidityUSD: { gt: 100 },
          protocol: { in: [PROTOCOL] },
        },
      },
      pools1: {
        select: {
          address: true,
          protocol: true,
          type: true,
          version: true,
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
          liquidityUSD: { gt: 100 },
          protocol: { in: [PROTOCOL] },
        },
      },
    },
  })
  // const topPairs = await prisma.pool.findMany({
  //   take: 500,
  //   where: {
  //     chainId: chainId.toString(),
  //     protocol: { in: [PROTOCOL] },
  //     token0: {
  //       id: {
  //         notIn: tokenAddresses,
  //       },
  //     },
  //     token1: {
  //       id: {
  //         notIn: tokenAddresses,
  //       },
  //     },
  //   },
  //   select: {
  //     address: true,
  //     protocol: true,
  //     type: true,
  //     version: true,
  //     token0: {
  //       select: {
  //         address: true,
  //         symbol: true,
  //         name: true,
  //         decimals: true,
  //       },
  //     },
  //     token1: {
  //       select: {
  //         address: true,
  //         symbol: true,
  //         name: true,
  //         decimals: true,
  //       },
  //     },
  //   },
  //   // include: {
  //   //   token0: true,
  //   //   token1: true,
  //   // },
  //   orderBy: {
  //     liquidityUSD: 'desc',
  //   },
  // })

  if (!tokenWithPools) {
    return response.status(204).json({ message: 'No token found.' })
  }
  if (tokenWithPools.pools0.length === 0 && tokenWithPools.pools1.length === 0) {
    return response.status(204).json({ message: 'Token found, but no pools.' })
  }

  const pools = Array.from(
    new Set(
      [
        tokenWithPools.pools0.map((pool) => ({
          address: pool.address,
          protocol: pool.protocol,
          type: pool.type,
          version: pool.version,
          token: pool.token0.address.toLowerCase() === tokenAddress.toString() ? pool.token1 : pool.token0,
        })),
        ,
        tokenWithPools.pools1.map((pool) => ({
          address: pool.address,
          protocol: pool.protocol,
          type: pool.type,
          version: pool.version,
          token: pool.token0.address.toLowerCase() === tokenAddress.toString() ? pool.token1 : pool.token0,
        })),
        ,
      ].flat()
    )
  )

  return response.status(200).json({
    token: {
      address: tokenWithPools.address,
      symbol: tokenWithPools.symbol,
      name: tokenWithPools.name,
      decimals: tokenWithPools.decimals,
      pools,
    },
  })
}
