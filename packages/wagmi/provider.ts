import {
  AlchemyProvider,
  AlchemyWebSocketProvider,
  BaseProvider,
  InfuraProvider,
  InfuraWebSocketProvider,
  WebSocketProvider,
} from '@ethersproject/providers'
import { ChainId } from '@sushiswap/chain'

const providerCache: Partial<Record<ChainId, BaseProvider>> = {}
const websocketProviderCache: Partial<Record<ChainId, WebSocketProvider>> = {}

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

const ANKR_API_KEY: Record<number, string | undefined> = {
  [ChainId.ETHEREUM]: process.env.ANKR_ETHEREUM_ID || process.env.NEXT_PUBLIC_ANKR_ETHEREUM_ID,
  [ChainId.POLYGON]: process.env.ANKR_POLYGON_ID || process.env.NEXT_PUBLIC_ANKR_POLYGON_ID,
  [ChainId.ARBITRUM]: process.env.ANKR_ARBITRUM_ID || process.env.NEXT_PUBLIC_ANKR_ARBITRUM_ID,
  [ChainId.OPTIMISM]: process.env.ANKR_OPTIMISM_ID || process.env.NEXT_PUBLIC_ANKR_OPTIMISM_ID,
}

const ALCHEMY_API_KEY: Record<number, string | undefined> = {
  [ChainId.ETHEREUM]: process.env.ALCHEMY_ID || process.env.NEXT_PUBLIC_ALCHEMY_ID,
  [ChainId.ARBITRUM]: process.env.ALCHEMY_ID || process.env.NEXT_PUBLIC_ALCHEMY_ID,
  [ChainId.OPTIMISM]: process.env.ALCHEMY_ID || process.env.NEXT_PUBLIC_ALCHEMY_ID,
  [ChainId.POLYGON]: process.env.ALCHEMY_ID || process.env.NEXT_PUBLIC_ALCHEMY_ID,
  [ChainId.POLYGON_TESTNET]: process.env.ALCHEMY_ID || process.env.NEXT_PUBLIC_ALCHEMY_ID,
  [ChainId.GÖRLI]: process.env.ALCHEMY_ID || process.env.NEXT_PUBLIC_ALCHEMY_ID,
}

export function getProvider(chainId: ChainId) {
  if (providerCache[chainId]) return providerCache[chainId]!

  if (ALCHEMY_ENABLED_CHAINS.includes(chainId)) {
    const alchemyKey = ALCHEMY_API_KEY[chainId]
    if (!alchemyKey) throw new Error('ALCHEMY_ID || NEXT_PUBLIC_ALCHEMY_ID is required for provider')
    const name = getAlchemyChainName(chainId)
    providerCache[chainId] = new AlchemyProvider(name, ALCHEMY_API_KEY[chainId])
  } else if (INFURA_ENABLED_CHAINS.includes(chainId)) {
    const infuraKey = process.env.INFURA_PROJECT_ID || process.env.NEXT_PUBLIC_INFURA_ID
    if (!infuraKey) throw new Error('INFURA_PROJECT_ID || NEXT_PUBLIC_INFURA_ID is required for provider')
    const name = getInfuraChainName(chainId)
    providerCache[chainId] = new InfuraProvider(name, infuraKey)
  } else if (ANKR_ENABLED_CHAINS.includes(chainId)) {
    const ankrKey = ANKR_API_KEY[chainId]
    if (!ankrKey) throw new Error('PUBLIC_ANKR_ID || NEXT_PUBLIC_ANKR_ID is required for provider')
    // const name = getAnkrChainName(chainId)
    // providerCache[chainId] = new AnkrProvider(name, ankrKey)
  }

  return providerCache[chainId]!
}

export function getProviders(chainIds: ChainId[]) {
  return chainIds.map(getProvider)
}

export function getWebsocketProvider(chainId: ChainId) {
  if (websocketProviderCache[chainId]) return websocketProviderCache[chainId]!

  if (ALCHEMY_ENABLED_CHAINS.includes(chainId)) {
    const alchemyKey = ALCHEMY_API_KEY[chainId]
    if (!alchemyKey) throw new Error('ALCHEMY_API_KEY || NEXT_PUBLIC_ALCHEMY_API_KEY is required for provider')
    const name = getAlchemyChainName(chainId)
    websocketProviderCache[chainId] = new AlchemyWebSocketProvider(name, ALCHEMY_API_KEY[chainId])
  } else if (INFURA_ENABLED_CHAINS.includes(chainId)) {
    const infuraKey = process.env.INFURA_PROJECT_ID || process.env.NEXT_PUBLIC_INFURA_ID
    if (!infuraKey) throw new Error('INFURA_PROJECT_ID || process.env.NEXT_PUBLIC_INFURA_ID is required for provider')
    const name = getInfuraChainName(chainId)
    websocketProviderCache[chainId] = new InfuraWebSocketProvider(name, infuraKey)
  }

  return websocketProviderCache[chainId]!
}

export function getWebsocketProviders(chainIds: ChainId[]) {
  return chainIds.map(getWebsocketProvider)
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
