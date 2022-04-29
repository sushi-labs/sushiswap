import { ChainId } from '@sushiswap/core-sdk'
import request from 'graphql-request'
import { GRAPH_HOST } from '../constants'
import { tridentFactoryQuery } from '../fetchers/trident'

const TRIDENT = {
  [ChainId.MATIC]: 'matthewlilley/trident-polygon',
}

async function getTridentFactory(chainId: number) {
  try {
    const { factories } = await request(
      `${GRAPH_HOST[chainId]}/subgraphs/name/${TRIDENT[chainId]}`,
      tridentFactoryQuery,
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
  for (const chainId of Object.keys(TRIDENT) as unknown as number[]) {
    factoryQueries.push(getTridentFactory(chainId))
  }

  return (await Promise.all(factoryQueries)).reduce((acc, cur) => {
    return {
      volumeUSD: acc.volumeUSD + cur.volumeUSD,
      poolCount: acc.poolCount + cur.poolCount,
    }
  })
}
