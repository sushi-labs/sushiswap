import { ChainId } from '@sushiswap/core-sdk'

import { GRAPH_HOST } from '../constants'
import { pager } from '../pager'
import { bentoTokensQuery } from '../queries/bentobox'
import { getNativePrice, getTokenPrices } from './exchange'

export const BENTOBOX = {
  [ChainId.ETHEREUM]: 'matthewlilley/bentobox-ethereum',
  [ChainId.XDAI]: 'matthewlilley/bentobox-gnosis',
  [ChainId.MATIC]: 'matthewlilley/bentobox-polygon',
  [ChainId.FANTOM]: 'matthewlilley/bentobox-fantom',
  [ChainId.BSC]: 'matthewlilley/bentobox-bsc',
  [ChainId.ARBITRUM]: 'matthewlilley/bentobox-arbitrum',
  [ChainId.AVALANCHE]: 'matthewlilley/bentobox-avalanche',
  [ChainId.MOONBEAM]: 'matthewlilley/bentobox-moonbeam',
  [ChainId.MOONRIVER]: 'matthewlilley/bentobox-moonriver',
  [ChainId.CELO]: 'matthewlilley/bentobox-celo',
}

export default async function getBentoTVL() {
  const bentoTVLQueries: Promise<number>[] = []
  for (const chainId of Object.keys(BENTOBOX) as unknown as number[]) {
    bentoTVLQueries.push(
      (async function () {
        try {
          const nativePrice = await getNativePrice(chainId)
          const { tokens: bentoTokens } = await pager(
            `${GRAPH_HOST[chainId]}/subgraphs/name/${BENTOBOX[chainId]}`,
            bentoTokensQuery,
          )
          const tokenPrices = await getTokenPrices(
            bentoTokens.map((bentoToken) => bentoToken.id),
            chainId,
          )

          return bentoTokens
            .map((bentoToken) => {
              const tokenPriceUSD =
                Number(tokenPrices.find((tokenPrice) => tokenPrice.id === bentoToken.id)?.derivedETH ?? 0) * nativePrice

              return bentoToken.rebase.elastic * tokenPriceUSD
            })
            .reduce((acc, cur) => acc + cur, 0)
        } catch {
          return 0
        }
      })(),
    )
  }

  return (await Promise.all(bentoTVLQueries)).reduce((acc, cur) => acc + cur, 0)
}
