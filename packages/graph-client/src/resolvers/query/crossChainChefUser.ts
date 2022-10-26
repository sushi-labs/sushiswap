import { ChainId, chainName } from '@sushiswap/chain'
import {
  MASTERCHEF_V1_SUBGRAPH_NAME,
  MASTERCHEF_V2_SUBGRAPH_NAME,
  MINICHEF_SUBGRAPH_NAME,
  SUBGRAPH_HOST,
} from '@sushiswap/graph-config'

import { getBuiltGraphSDK, QueryResolvers } from '../../../.graphclient'

export const crossChainChefUser: QueryResolvers['crossChainChefUser'] = async (root, args) => {
  const fetcher = async ({
    chainId,
    subgraphName,
    subgraphHost,
  }: {
    chainId: ChainId
    subgraphName: string
    subgraphHost: string
  }) => {
    const sdk = getBuiltGraphSDK({ subgraphHost, subgraphName, chainId })

    return sdk
      .ChefUser({
        // @ts-ignore
        where: args.where,
        // @ts-ignore
        block: args.block,
      })
      .then(({ users }) => {
        return users.map((user) => ({
          ...user,
          chainId,
          chainName: chainName[chainId],
        }))
      })
  }

  return Promise.allSettled([
    ...(args.chainIds.includes(ChainId.ETHEREUM)
      ? [MASTERCHEF_V1_SUBGRAPH_NAME, MASTERCHEF_V2_SUBGRAPH_NAME].map((subgraphName) =>
          fetcher({ chainId: ChainId.ETHEREUM, subgraphName, subgraphHost: SUBGRAPH_HOST[ChainId.ETHEREUM] })
        )
      : []),
    ...args.chainIds
      .filter((chainId): chainId is keyof typeof MINICHEF_SUBGRAPH_NAME => chainId in MINICHEF_SUBGRAPH_NAME)
      .map((chainId) =>
        fetcher({ chainId, subgraphName: MINICHEF_SUBGRAPH_NAME[chainId], subgraphHost: SUBGRAPH_HOST[chainId] })
      ),
  ]).then((users) => {
    return users.flat().reduce((acc, cur) => {
      if (cur.status === 'fulfilled' && cur.value.length > 0) {
        acc.push(...cur.value)
      }

      return acc
    }, [] as Awaited<ReturnType<typeof fetcher>>)
  })
}
