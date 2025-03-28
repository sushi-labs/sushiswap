import { type ChainId, ChainKey, EvmChain } from 'sushi/chain'
import { NonStandardChain, type NonStandardChainId } from '../config'

export const getNetworkName = (network: ChainId | NonStandardChainId) => {
  return typeof network === 'number'
    ? EvmChain.from(network)?.name
    : NonStandardChain[network].name
}

export const getNetworkKey = (network: ChainId | NonStandardChainId) => {
  return typeof network === 'number' ? ChainKey[network] : network
}

export const replaceNetworkSlug = (
  network: ChainId | NonStandardChainId,
  pathname: string,
) => {
  if (pathname.includes('/pool/')) {
    return `/${getNetworkKey(network)}/explore/pools`
  }
  if (pathname.includes('/token/')) {
    return `/${getNetworkKey(network)}/explore/tokens`
  }
  const pathSegments = pathname.split('/')
  pathSegments[1] = getNetworkKey(network)
  return pathSegments.join('/')
}
