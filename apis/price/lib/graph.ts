import { getBuiltGraphSDK } from '../.graphclient'
import { LEGACY_SUBGRAPH_NAME, SUPPORTED_CHAINS } from '../config'

const GRAPH_HOST = 'api.thegraph.com'

export const getPrices = async (chainId: string) => {
  if (!SUPPORTED_CHAINS.includes(Number(chainId))) {
    throw Error(`Unsupported Chain ${chainId}`)
  }
  const sdk = await getBuiltGraphSDK({ chainId, host: GRAPH_HOST, name: LEGACY_SUBGRAPH_NAME[chainId] })
  return await sdk.TokenPrices()
}
