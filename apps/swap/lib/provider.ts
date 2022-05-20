import { ChainId } from '@sushiswap/chain'
import { providers } from 'ethers'

const providerCache: Partial<Record<ChainId, providers.BaseProvider>> = {}

const ALCHEMY_ENABLED_CHAINS = [
  ChainId.ETHEREUM,
  ChainId.POLYGON,
  ChainId.POLYGON_TESTNET,
  ChainId.ARBITRUM,
  ChainId.OPTIMISM,
  ChainId.GÖRLI,
]

const INFURA_ENABLED_CHAINS = [
  ChainId.ETHEREUM,
  ChainId.POLYGON,
  ChainId.ARBITRUM,
  ChainId.OPTIMISM,
  ChainId.ROPSTEN,
  ChainId.RINKEBY,
  ChainId.KOVAN,
]

const ANKR_ENABLED_CHAINS = [ChainId.ETHEREUM, ChainId.POLYGON, ChainId.ARBITRUM, ChainId.OPTIMISM]

const ALCHEMY_API_KEY: Record<number, string> = {
  [ChainId.ETHEREUM]: 'q1pMGalg0HNBvK1eaZoo-vng-EPWlt1t',
  [ChainId.ARBITRUM]: 'eO_ha0kuIlFWSqXokR6-K5LzGx4qB9XV',
  [ChainId.OPTIMISM]: 'rtbMqQGp96fbuXxzUS2fct34eYzA7tY8',
  [ChainId.POLYGON]: 'vZft72lBzQ100fCIJTyohJR1tWrMsUei',
  [ChainId.POLYGON_TESTNET]: 'JW13aE7MytaJNzSZ-BI4L-XfmaMqMip_',
  [ChainId.GÖRLI]: 'BXrZLhuc63Gn91NoLVVFDJ010M-AwOa2',
}

export function getProvider(chainId: ChainId) {
  if (providerCache[chainId]) return providerCache[chainId]!

  if (ALCHEMY_ENABLED_CHAINS.includes(chainId)) {
    // const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_ID
    // if (!alchemyKey) throw new Error('NEXT_PUBLIC_ALCHEMY_ID is required for provider')

    // console.log('ALCHEMY', chainId, ALCHEMY_ENABLED_CHAINS, getAlchemyChainName(chainId))
    const name = getAlchemyChainName(chainId)
    providerCache[chainId] = new providers.AlchemyProvider(name, ALCHEMY_API_KEY[chainId])
  } else if (INFURA_ENABLED_CHAINS.includes(chainId)) {
    const infuraKey = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
    if (!infuraKey) throw new Error('NEXT_PUBLIC_INFURA_PROJECT_ID is required for provider')
    // console.log('INFURA', chainId, INFURA_ENABLED_CHAINS, getInfuraChainName(chainId))
    const name = getInfuraChainName(chainId)
    providerCache[chainId] = new providers.InfuraProvider(name, infuraKey)
  } else if (ANKR_ENABLED_CHAINS.includes(chainId)) {
    // const ankrKey = process.env.NEXT_PUBLIC_ANKR_ID
    // if (!ankrKey) throw new Error('NEXT_PUBLIC_ANKR_ID is required for provider')
    // const name = getAnkrChainName(chainId)
    // providerCache[chainId] = new providers.AnkrProvider(name, ankrKey)
  }

  return providerCache[chainId]!
}

export function getProviders(chainIds: ChainId[]) {
  return chainIds.map(getProvider)
}

export function getAlchemyChainName(chainId: ChainId) {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return 'homestead'
    case ChainId.POLYGON:
      return 'matic'
    case ChainId.POLYGON_TESTNET:
      return 'maticmum'
    case ChainId.ARBITRUM:
      return 'arbitrum'
    case ChainId.OPTIMISM:
      return 'optimism'
    case ChainId.GÖRLI:
      return 'goerli'
    default:
      throw new Error(`Unsupported eth alchemy chainId for ${chainId}`)
  }
}

export function getInfuraChainName(chainId: ChainId) {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return 'homestead'
    case ChainId.POLYGON:
      return 'matic'
    case ChainId.ARBITRUM:
      return 'arbitrum'
    case ChainId.RINKEBY:
      return 'rinkeby'
    case ChainId.ROPSTEN:
      return 'ropsten'
    case ChainId.GÖRLI:
      return 'goerli'
    case ChainId.KOVAN:
      return 'kovan'
    default:
      throw new Error(`Unsupported eth infura chainId for ${chainId}`)
  }
}
