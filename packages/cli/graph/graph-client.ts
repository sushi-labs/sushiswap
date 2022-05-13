import { getBuiltGraphSDK } from './../.graphclient'
import { ChainId, ChainKey } from '@sushiswap/chain'

export const getMakerLPs = async (chain: ChainKey | undefined) => {
  const SUPPORTED_CHAINS = [
    ChainKey.ETHEREUM,
    ChainKey.FANTOM,
    //   ChainId.POLYGON,
    //   ChainId.,
    // ChainId.ARBITRUM
  ]

  if (!chain || !SUPPORTED_CHAINS.includes(chain)) {
    throw new Error('Unsupported chains. Supported chains are: '.concat(SUPPORTED_CHAINS.join(", ")))
  }
  const sdk = await getBuiltGraphSDK()
  if (chain === ChainKey.ETHEREUM) {
    return await (await sdk.LiquidityPositions()).ETHEREUM_EXCHANGE_user?.liquidityPositions
  } else if (chain === ChainKey.FANTOM) {
    // return (await sdk.GoerliUserStreams({ id })).GOERLI_STREAM_user ?? {}
  }
}
