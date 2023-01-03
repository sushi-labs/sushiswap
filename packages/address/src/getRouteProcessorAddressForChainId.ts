import { ChainId } from '@sushiswap/chain'

import { ROUTE_PROCESSOR_ADDRESS } from '.'

export function getRouteProcessorAddressForChainId(chainId: ChainId) {
  if (!(chainId in ROUTE_PROCESSOR_ADDRESS)) {
    throw new Error(`Unsupported route processor network for ${chainId}`)
  }
  return ROUTE_PROCESSOR_ADDRESS[chainId as keyof typeof ROUTE_PROCESSOR_ADDRESS]
}
