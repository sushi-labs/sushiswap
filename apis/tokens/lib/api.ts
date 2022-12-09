import prisma from '@sushiswap/database'

export async function getTokens(chainId: string | number = 1) {
  const tokens = await prisma.token.findMany({
    select: {
      id: true,
      address: true,
      chainId: true,
      name: true,
      symbol: true,
      decimals: true,
    },
    where: {
      AND: {
        chainId: Number(chainId),
        status: 'APPROVED',
      },
    },
  })
  await prisma.$disconnect()
  return tokens ? tokens : []
}
