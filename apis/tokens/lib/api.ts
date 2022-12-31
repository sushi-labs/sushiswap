import prisma from '@sushiswap/database'

export async function getToken(chainId: number, address: string) {
  const token = await prisma.token.findFirstOrThrow({
    select: {
      id: true,
      address: true,
      name: true,
      symbol: true,
      decimals: true,
    },
    where: {
      AND: {
        chainId,
        address,
        status: 'APPROVED',
      },
    },
  })
  await prisma.$disconnect()
  return token
}

export async function getTokenIdsByChainId(chainId: number) {
  const ids = await prisma.token.findMany({
    select: {
      id: true,
    },
    where: {
      AND: {
        chainId,
        status: 'APPROVED',
      },
    },
  })
  await prisma.$disconnect()
  return ids ? ids : []
}

export async function getTokenAddressesByChainId(chainId: number) {
  const addresses = await prisma.token.findMany({
    select: {
      address: true,
    },
    where: {
      AND: {
        chainId,
        status: 'APPROVED',
      },
    },
  })
  await prisma.$disconnect()
  return addresses ? addresses : []
}

export async function getTokensByChainId(chainId: number) {
  const tokens = await prisma.token.findMany({
    select: {
      id: true,
      address: true,
      name: true,
      symbol: true,
      decimals: true,
    },
    where: {
      AND: {
        chainId,
        status: 'APPROVED',
      },
    },
  })
  await prisma.$disconnect()
  return tokens ? tokens : []
}

export async function getTokens() {
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
        status: 'APPROVED',
      },
    },
  })
  await prisma.$disconnect()
  return tokens ? tokens : []
}
