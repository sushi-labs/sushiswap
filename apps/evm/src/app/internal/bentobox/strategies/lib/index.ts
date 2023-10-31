import { ChainId } from 'sushi/chain'

export async function getStrategies() {
  const { getBuiltGraphSDK } = await import('@sushiswap/graph-client')
  const sdk = getBuiltGraphSDK()

  const { crossChainStrategyKpis: data } = await sdk.CrossChainStrategyKpis({
    chainIds: [
      ChainId.ETHEREUM,
      ChainId.POLYGON,
      ChainId.AVALANCHE,
      ChainId.BSC,
      ChainId.FANTOM,
      ChainId.GNOSIS,
      ChainId.ARBITRUM,
      ChainId.CELO,
      ChainId.MOONRIVER,
      ChainId.MOONBEAM,
      ChainId.OPTIMISM,
      ChainId.HARMONY,
      // ChainId.KAVA,
    ],
  })

  return data
}
