import { ChainId } from '@sushiswap/chain'

import { ROUTE_PROCESSOR_ADDRESS } from '.'

export const isRouteProcessorSupported = (chainId: ChainId): chainId is keyof typeof ROUTE_PROCESSOR_ADDRESS => {
  return chainId in ROUTE_PROCESSOR_ADDRESS
}

export function getRouteProcessorAddressForChainId(chainId: ChainId) {
  if (!isRouteProcessorSupported(chainId)) {
    throw new Error(`Route processor unsupported for chain id: ${chainId}`)
  }
  return ROUTE_PROCESSOR_ADDRESS[chainId]
}
