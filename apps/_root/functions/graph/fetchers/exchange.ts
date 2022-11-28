import { EXCHANGE_SUBGRAPH_NAME, SUBGRAPH_HOST } from '@sushiswap/graph-config'
import request from 'graphql-request'

import { pager } from '../pager'
import { bundleQuery, factoryQuery, tokenPricesQuery } from '../queries/exchange'

export async function getNativePrice(chainId: number) {
  try {
    const { bundle } = await request(
      `https://${SUBGRAPH_HOST[chainId]}/${EXCHANGE_SUBGRAPH_NAME[chainId]}`,
      bundleQuery
    )

    return Number(bundle?.ethPrice) ?? 0
  } catch {
    return 0
  }
}

export async function getTokenPrices(tokens: string[], chainId: number) {
  try {
    const { tokens: tokenPrices } = await pager(
      `https://${SUBGRAPH_HOST[chainId]}/${EXCHANGE_SUBGRAPH_NAME[chainId]}`,
      tokenPricesQuery,
      {
        where: { id_in: tokens },
      }
    )

    return tokenPrices
  } catch {
    return []
  }
}

async function getFactory(chainId: number) {
  try {
    const { factories } = await request(
      `https://${SUBGRAPH_HOST[chainId]}/${EXCHANGE_SUBGRAPH_NAME[chainId]}`,
      factoryQuery
    )
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
  for (const chainId of Object.keys(EXCHANGE_SUBGRAPH_NAME) as unknown as number[]) {
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
