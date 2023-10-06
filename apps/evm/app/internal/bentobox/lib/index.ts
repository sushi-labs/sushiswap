import { ChainId } from 'sushi/chain'

const reduceObjectArray = (arr: Record<string, unknown>[]) => {
  const keys = Object.keys(arr[0])

  return Object.fromEntries(keys.map((key) => [key, arr.reduce((acc, cur) => Number(cur[key]) + acc, 0)]))
}

const keyTitleMap: Record<string, string> = {
  depositCount: 'Deposit Count',
  withdrawCount: 'Withdraw Count',
  transferCount: 'Transfer Count',
  protocolCount: 'Protocol Count',
  userCount: 'User Count',
  tokenCount: 'Token Count',
  masterContractCount: 'Master Contract Count',
  cloneCount: 'Clone Count',
  flashloanCount: 'Flashloan Count',
  transactionCount: 'Transaction Count',
  strategyCount: 'Strategy Count',
  activeStrategyCount: 'Active Strategy Count',
  pendingStrategyCount: 'Pending Strategy Count',
}

export async function getBentoBoxKpis() {
  const { getBuiltGraphSDK } = await import('@sushiswap/graph-client')
  const sdk = getBuiltGraphSDK()

  const { crossChainBentoBoxKpis } = await sdk.CrossChainBentoBoxKpis({
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

  const reducedKpis = reduceObjectArray(crossChainBentoBoxKpis)

  const kpis = Object.entries(keyTitleMap).map(([key, title]) => ({ name: title, value: reducedKpis[key] }))

  return kpis
}
