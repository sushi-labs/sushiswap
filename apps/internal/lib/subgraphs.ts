import { ChainId } from '@sushiswap/chain'
import {
  BENTOBOX_SUBGRAPH_NAME,
  BLOCKS_SUBGRAPH_NAME,
  EXCHANGE_SUBGRAPH_NAME,
  FURO_SUBGRAPH_NAME,
  GRAPH_HOST,
  KASHI_SUBGRAPH_NAME,
  MINICHEF_SUBGRAPH_NAME,
  SUBGRAPH_HOST,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'

import { getBuiltGraphSDK } from '.graphclient'

export type Subgraph = Awaited<ReturnType<typeof getSubgraphs>>[0]

const CATEGORIES = {
  BENTOBOX: { ...BENTOBOX_SUBGRAPH_NAME },
  BLOCKS: { ...BLOCKS_SUBGRAPH_NAME },
  EXCHANGE: { ...EXCHANGE_SUBGRAPH_NAME },
  TRIDENT: { ...TRIDENT_SUBGRAPH_NAME },
  KASHI: { ...KASHI_SUBGRAPH_NAME },
  CHEF: {
    ...MINICHEF_SUBGRAPH_NAME,
    [ChainId.ETHEREUM + '-1']: 'jiro-ono/masterchef-staging',
    [ChainId.ETHEREUM + '-2']: 'sushiswap/master-chefv2',
  },
  FURO: { ...FURO_SUBGRAPH_NAME },
  OTHER: {},
} as const

const lowerCaseAllWordsExceptFirstLetters = (string: string): string =>
  string.replaceAll(/\S*/g, (word) => `${word.slice(0, 1)}${word.slice(1).toLowerCase()}`)

const parseCategories = () => {
  return Object.keys(CATEGORIES)
    .flatMap((categoryKey: keyof typeof CATEGORIES) =>
      // @ts-ignore
      Object.keys(CATEGORIES[categoryKey]).map((chainKey: keyof typeof CATEGORIES['BENTOBOX']) => ({
        chainId: Number(String(chainKey).split('-')[0]),
        subgraphName: CATEGORIES[categoryKey][chainKey] as string,
        category: lowerCaseAllWordsExceptFirstLetters(categoryKey),
      }))
    )
    .filter(({ chainId }) => SUBGRAPH_HOST[chainId] === GRAPH_HOST)
}

interface GetSubgraphs {
  filter?: string
}

export async function getSubgraphs({ filter }: GetSubgraphs = {}) {
  const sdk = getBuiltGraphSDK()
  const subgraphs = parseCategories()

  const subgraphNames = subgraphs
    .map((subgraph) => subgraph.subgraphName)
    .filter((name) => (filter ? name.includes(filter) : true))

  async function fetch(type: 'Current' | 'Pending') {
    return sdk.Subgraphs({ subgraphNames: subgraphNames, type })
  }

  return (await Promise.all((['Current', 'Pending'] as const).map((type) => fetch(type))))
    .flat(1)
    .flatMap(({ subgraphs: res }) =>
      res
        .map((data) => ({
          ...data,
          ...subgraphs.find(({ subgraphName }) => subgraphName === data.subgraphName),
        }))
        .filter(Boolean)
    )
}
