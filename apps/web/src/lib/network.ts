import { Chain, ChainId, ChainKey } from 'sushi/chain'
import { NonStandardChain, NonStandardChainId } from '../config'

export const getNetworkName = (network: ChainId | NonStandardChainId) => {
  return typeof network === 'number'
    ? Chain.from(network)?.name
    : NonStandardChain[network].name
}

export const replaceNetworkSlug = (
  pathname: string,
  network: ChainId | NonStandardChainId,
) => {
  const pathSegments = pathname.split('/')
  pathSegments[1] = typeof network === 'number' ? ChainKey[network] : network
  return pathSegments.join('/')
}
