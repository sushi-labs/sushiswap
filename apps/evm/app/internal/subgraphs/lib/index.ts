import { getBuiltGraphSDK } from '@sushiswap/graph-client'
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
import { ChainId } from 'sushi/chain'

export type Subgraph = Awaited<ReturnType<typeof getSubgraphs>>[0]

const CATEGORIES = {
  BENTOBOX: { ...BENTOBOX_SUBGRAPH_NAME },
  BLOCKS: { ...BLOCKS_SUBGRAPH_NAME },
  EXCHANGE: { ...EXCHANGE_SUBGRAPH_NAME },
  TRIDENT: { ...TRIDENT_SUBGRAPH_NAME },
  KASHI: { ...KASHI_SUBGRAPH_NAME },
  CHEF: {
    ...MINICHEF_SUBGRAPH_NAME,
    [`${ChainId.ETHEREUM}-1`]: 'jiro-ono/masterchef-staging',
    [`${ChainId.ETHEREUM}-2`]: 'sushiswap/master-chefv2',
  },
  FURO: { ...FURO_SUBGRAPH_NAME },
  OTHER: {},
} as const

type CategoryKey = keyof typeof CATEGORIES
// type Category = typeof CATEGORIES[CategoryKey]

const NODE_URLS: Record<number, string> = {
  ...Object.keys(SUBGRAPH_HOST)
    .map(Number)
    .filter(
      (chainId): chainId is keyof typeof SUBGRAPH_HOST =>
        chainId in SUBGRAPH_HOST,
    )
    .filter((chainId) => SUBGRAPH_HOST[chainId] === GRAPH_HOST)
    .reduce(
      (acc, chainId) => ({
        ...acc,
        [Number(chainId)]: 'api.thegraph.com/index-node/graphql',
      }),
      {},
    ),
  [ChainId.KAVA]: 'pvt-metrics.graph.kava.io/graphql',
  // [ChainId.METIS]: '',
}

const lowerCaseAllWordsExceptFirstLetters = (string: string): string =>
  string.replaceAll(
    /\S*/g,
    (word) => `${word.slice(0, 1)}${word.slice(1).toLowerCase()}`,
  )

const parseCategories = () => {
  return (
    Object.keys(CATEGORIES)
      // @ts-ignore
      .flatMap((categoryKey: keyof typeof CATEGORIES) =>
        // @ts-ignore
        Object.keys(CATEGORIES[categoryKey]).map(
          // @ts-ignore
          (chainKey: keyof typeof CATEGORIES['BENTOBOX']) => ({
            chainId: Number(String(chainKey).split('-')[0]),
            // @ts-ignore
            subgraphName: CATEGORIES[categoryKey][chainKey] as string,
            category: lowerCaseAllWordsExceptFirstLetters(categoryKey),
          }),
        ),
      )
      .filter(({ chainId }) => Object.keys(NODE_URLS).includes(String(chainId)))
  )
}

interface GetSubgraphs {
  filter?: string
}

export async function getSubgraphs({ filter }: GetSubgraphs = {}) {
  const sdk = getBuiltGraphSDK()

  const subgraphs = parseCategories()

  const subgraphInputs = subgraphs
    .map(({ subgraphName, chainId }) => ({
      subgraphName,
      nodeUrl: NODE_URLS[chainId],
    }))
    .filter(({ subgraphName }) =>
      filter ? subgraphName.includes(filter) : true,
    )

  async function fetch(type: 'Current' | 'Pending') {
    return sdk.Subgraphs({ subgraphs: subgraphInputs, type })
  }

  return (
    await Promise.all(
      (['Current', 'Pending'] as const).map((type) => fetch(type)),
    )
  )
    .flat(1)
    .flatMap(({ subgraphs: res }) =>
      res
        // @ts-ignore
        .map((data) => ({
          ...data,
          ...subgraphs.find(
            ({ subgraphName }) => subgraphName === data.subgraphName,
          ),
        }))
        .filter(Boolean),
    )
}
