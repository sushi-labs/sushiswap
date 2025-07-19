import type { ChainId } from 'sushi'
import { getChainById } from 'sushi'

export const getNetworkName = (network: ChainId) => {
  return getChainById(network).name
}

export const getNetworkKey = (network: ChainId) => {
  return typeof network === 'number' ? getChainById(network).key : network
}

export const replaceNetworkSlug = (network: ChainId, pathname: string) => {
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
