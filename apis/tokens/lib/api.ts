import { client } from '@sushiswap/database'

export async function getToken(chainId: number, address: string) {
  const token = await client.token.findFirstOrThrow({
    select: {
      id: true,
      address: true,
      name: true,
      symbol: true,
      decimals: true,
      isCommon: true,
      isFeeOnTransfer: true,
    },
    where: {
      AND: {
        chainId,
        address,
        // If asking for the token directly, we probably want to see it even if it's not approved
        // status: 'APPROVED',
      },
    },
  })
  await client.$disconnect()
  return token
}

export async function getTokenIdsByChainId(chainId: number) {
  const ids = await client.token.findMany({
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
  await client.$disconnect()
  return ids ? ids : []
}

export async function getTokenAddressesByChainId(chainId: number) {
  const addresses = await client.token.findMany({
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
  await client.$disconnect()
  return addresses ? addresses : []
}

export async function getTokensByChainId(chainId: number) {
  const tokens = await client.token.findMany({
    select: {
      id: true,
      address: true,
      name: true,
      symbol: true,
      decimals: true,
      isCommon: true,
      isFeeOnTransfer: true,
    },
    where: {
      AND: {
        chainId,
        status: 'APPROVED',
      },
    },
  })
  await client.$disconnect()
  return tokens ? tokens : []
}

export async function getTokens() {
  const tokens = await client.token.findMany({
    select: {
      id: true,
      address: true,
      chainId: true,
      name: true,
      symbol: true,
      decimals: true,
      isCommon: true,
      isFeeOnTransfer: true,
    },
    where: {
      AND: {
        status: 'APPROVED',
      },
    },
  })
  await client.$disconnect()
  return tokens ? tokens : []
}
