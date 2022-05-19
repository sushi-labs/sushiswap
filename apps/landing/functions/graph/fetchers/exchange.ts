import { ChainId } from '@sushiswap/core-sdk'
import request from 'graphql-request'

import { GRAPH_HOST } from '../constants'
import { pager } from '../pager'
import { bundleQuery, factoryQuery, tokenPricesQuery } from '../queries/exchange'

export const EXCHANGE = {
  [ChainId.ETHEREUM]: 'sushiswap/exchange',
  [ChainId.XDAI]: 'sushiswap/xdai-exchange',
  [ChainId.MATIC]: 'sushiswap/matic-exchange',
  [ChainId.FANTOM]: 'sushiswap/fantom-exchange',
  [ChainId.BSC]: 'sushiswap/bsc-exchange',
  // [ChainId.HARMONY]: 'sushiswap/harmony-exchange',
  [ChainId.AVALANCHE]: 'sushiswap/avalanche-exchange',
  [ChainId.CELO]: 'jiro-ono/sushitestsubgraph',
  [ChainId.ARBITRUM]: 'sushiswap/arbitrum-exchange',
  [ChainId.MOONRIVER]: 'sushiswap/moonriver-exchange',
  [ChainId.HECO]: 'heco-exchange/heco',
  [ChainId.FUSE]: 'sushiswap/fuse-exchange',
  [ChainId.MOONBEAM]: 'sushiswap/moonbeam-exchange',
}

export async function getNativePrice(chainId: number) {
  try {
    const { bundle } = await request(`${GRAPH_HOST[chainId]}/subgraphs/name/${EXCHANGE[chainId]}`, bundleQuery)

    return Number(bundle?.ethPrice) ?? 0
  } catch {
    return 0
  }
}

export async function getTokenPrices(tokens: string[], chainId: number) {
  try {
    const { tokens: tokenPrices } = await pager(
      `${GRAPH_HOST[chainId]}/subgraphs/name/${EXCHANGE[chainId]}`,
      tokenPricesQuery,
      {
        where: { id_in: tokens },
      },
    )

    return tokenPrices
  } catch {
    return []
  }
}

async function getFactory(chainId: number) {
  try {
    const { factories } = await request(`${GRAPH_HOST[chainId]}/subgraphs/name/${EXCHANGE[chainId]}`, factoryQuery)
    const factory = factories[0]

    return {
      volumeUSD: Number(factory.volumeUSD),
      tvlUSD: Number(factory.liquidityUSD),
      pairCount: Number(factory.pairCount),
      userCount: Number(factory.userCount),
    }
  } catch {
    return {
      volumeUSD: 0,
      tvlUSD: 0,
      pairCount: 0,
      userCount: 0,
    }
  }
}

export async function getLegacyExchangeData() {
  const factoryQueries: ReturnType<typeof getFactory>[] = []
  for (const chainId of Object.keys(EXCHANGE) as unknown as number[]) {
    factoryQueries.push(getFactory(chainId))
  }

  return (await Promise.all(factoryQueries)).reduce((acc, cur) => {
    return {
      volumeUSD: acc.volumeUSD + cur.volumeUSD,
      tvlUSD: acc.tvlUSD + cur.tvlUSD,
      pairCount: acc.pairCount + cur.pairCount,
      userCount: acc.userCount + cur.userCount,
    }
  })
}
