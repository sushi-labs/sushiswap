

import { SUPPORTED_CHAIN_IDS } from 'src/config'
import { ChainId, chainShortName } from 'sushi/chain'

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

