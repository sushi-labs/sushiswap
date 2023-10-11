import { createClient } from '@sushiswap/database'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { ChainId, chainShortName } from 'sushi/chain'

// import { allChains, allProviders } from '@sushiswap/wagmi-config'
// import { Address, configureChains, createClient, fetchToken } from '@wagmi/core'

// const { provider } = configureChains(allChains, allProviders)
// createClient({
//   autoConnect: true,
//   provider,
// })

// export async function getToken(chainId: number, address: string) {
//   try {
//     const token = await client.token.findFirstOrThrow({
//       select: {
//         id: true,
//         address: true,
//         name: true,
//         symbol: true,
//         decimals: true,
//         isCommon: true,
//         isFeeOnTransfer: true,
//       },
//       where: {
//         AND: {
//           chainId,
//           address,
//           status: 'APPROVED',
//         },
//       },
//     })
//     await client.$disconnect()
//     return token
//   } catch (e) {
//     console.log(`Token not found in db: ${address} on chain ${chainId}`, e)
//   }

//   try {
//     const token = await fetchToken({ chainId, address: address as Address })
//     return token
//   } catch (e) {
//     console.log(`Token fetch fallback failed: ${address} on chain ${chainId}`, e)
//   }

//   throw new Error('Token not found')
// }

export async function getToken(chainId: number, address: string) {
  const client = await createClient()
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
  const client = await createClient()
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
  const client = await createClient()
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
  const client = await createClient()
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
  const client = await createClient()
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

export async function getUser(args: { id?: string; chainIds?: ChainId[] }) {
  const sdk = (
    await import('@sushiswap/graph-client').then((m) => m.getBuiltGraphSDK)
  )()
  if (!args.id) return []
  const { crossChainUserPositions: user } = await sdk.CrossChainUserPositions({
    chainIds: args.chainIds || SUPPORTED_CHAIN_IDS,
    id: args.id.toLowerCase(),
  })
  return user
}

export const getGraphPool = async (id: string) => {
  if (!id.includes(':')) throw Error('Invalid pair id')
  // Migrating to new format, graph-client uses the deprecated one
  const split = id.split(':')
  const sdk = (
    await import('@sushiswap/graph-client').then((m) => m.getBuiltGraphSDK)
  )()
  const { pair } = await sdk.PairById({
    id: `${chainShortName[split[0]]}:${split[1]}`,
  })
  return pair
}

export const getGraphPools = async (ids: string[]) => {
  if (!ids.every((id) => id.includes(':'))) throw Error('Invalid pair ids')

  // Migrating to new format, graph-client uses the deprecated one
  const addresses = ids.map((id) => id.split(':')[1])

  // PairsByIds would be better, not implemented though...
  // Need to hack around
  const sdk = (
    await import('@sushiswap/graph-client').then((m) => m.getBuiltGraphSDK)
  )()
  const { pairs } = await sdk.PairsByChainIds({
    chainIds: Array.from(new Set(ids.map((id) => Number(id.split(':')[0])))),
    where: {
      id_in: addresses,
    },
  })

  return (
    pairs
      .map((pair) => ({ ...pair, id: `${pair.chainId}:${pair.address}` }))
      // To prevent possible (although unlikely) collisions
      .filter((pair) => ids.includes(pair.id))
  )
}

export const getPoolsByTokenPair = async (
  tokenId0: string,
  tokenId1: string,
) => {
  const [chainId0, tokenAddress0] = tokenId0.split(':')
  if (!chainId0 || !tokenAddress0) throw Error('Invalid token0 id')

  const [chainId1, tokenAddress1] = tokenId1.split(':')
  if (!chainId1 || !tokenAddress1) throw Error('Invalid token1 id')

  if (chainId0 !== chainId1) throw Error('Tokens must be on the same chain')

  const sdk = (
    await import('@sushiswap/graph-client').then((m) => m.getBuiltGraphSDK)
  )()
  const { pools } = await sdk.PoolsByTokenPair({
    tokenId0,
    tokenId1,
  })

  return pools
}
