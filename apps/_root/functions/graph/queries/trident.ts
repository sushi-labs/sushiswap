import { SUBGRAPH_HOST, TRIDENT_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import request from 'graphql-request'

import { tridentFactoryQuery } from '../fetchers/trident'

async function getTridentFactory(chainId: number) {
  try {
    const { factories } = await request(
      `https://${SUBGRAPH_HOST[chainId]}/${TRIDENT_SUBGRAPH_NAME[chainId]}`,
      tridentFactoryQuery
    )
    const factory = factories[0]

    return {
      volumeUSD: Number(factory.volumeUSD),
      poolCount: Number(factory.poolCount),
    }
  } catch {
    return {
      volumeUSD: 0,
      poolCount: 0,
    }
  }
}

export async function getTridentExchangeData() {
  const factoryQueries: ReturnType<typeof getTridentFactory>[] = []
  for (const chainId of Object.keys(TRIDENT_SUBGRAPH_NAME) as unknown as number[]) {
    factoryQueries.push(getTridentFactory(chainId))
  }

  return (await Promise.all(factoryQueries)).reduce((acc, cur) => {
    return {
      volumeUSD: acc.volumeUSD + cur.volumeUSD,
      poolCount: acc.poolCount + cur.poolCount,
    }
  })
}
