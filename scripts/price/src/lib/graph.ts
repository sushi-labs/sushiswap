import { ChainId } from '@sushiswap/chain'

import { getBuiltGraphSDK } from '../../.graphclient'
import { GRAPH_HOST, LEGACY_SUBGRAPH_NAME, SUPPORTED_CHAINS } from '../config'

export const getPrices = async (chainId: ChainId) => {
  if (!SUPPORTED_CHAINS.includes(chainId)) {
    throw Error(`Unsupported Chain ${chainId}`)
  }
  const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: LEGACY_SUBGRAPH_NAME[chainId] })
  return { chainId, data: await sdk.TokenPrices() }
}
