import { FURO_SUBGRAPH_NAME } from '@sushiswap/graph-config'

import { getBuiltGraphSDK } from '../.graphclient'
import { SUPPORTED_CHAINS, SupportedChainId } from '../config'

const GRAPH_HOST = 'api.thegraph.com'

export const getStreamIds = async (chainId: string) => {
  if (!SUPPORTED_CHAINS.includes(Number(chainId) as SupportedChainId)) {
    throw Error(`Unsupported Chain ${chainId}`)
  }

  const sdk = getBuiltGraphSDK({
    chainId,
    host: GRAPH_HOST,
    name: FURO_SUBGRAPH_NAME[chainId],
  })

  return (await sdk.streamIds()).streams ?? []
}

export const getVestingIds = async (chainId: string) => {
  if (!SUPPORTED_CHAINS.includes(Number(chainId) as SupportedChainId)) {
    throw Error(`Unsupported Chain ${chainId}`)
  }

  const sdk = getBuiltGraphSDK({
    chainId,
    host: GRAPH_HOST,
    name: FURO_SUBGRAPH_NAME[chainId],
  })

  return (await sdk.vestingIds()).vestings ?? []
}
