import type { VercelRequest, VercelResponse } from '@vercel/node'
import prisma from '../../../lib/prisma'

export default async (request: VercelRequest, response: VercelResponse) => {
  const chainId = request.query.chainId as string
  const excludeTokensArg = request.query.excludeTokens as string
  const excludeTokens = excludeTokensArg ? excludeTokensArg.split(',') : []

  const PROTOCOL = 'SushiSwap' // Hardcoded for now, should be a string array param?

  const topPools = await prisma.pool.findMany({
    take: 500,
    where: {
      chainId: chainId.toString(),
      protocol: { in: [PROTOCOL] },
      AND: {
        token0: {
          address: {
            notIn: excludeTokens,
          },
        },
        token1: {
          address: {
            notIn: excludeTokens,
          },
        },
      }
    },
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
    // include: {
    //   token0: true,
    //   token1: true,
    // },
    orderBy: {
      liquidityUSD: 'desc',
    },
  })

  return response.status(200).json({
    pools: topPools,
  })
}
