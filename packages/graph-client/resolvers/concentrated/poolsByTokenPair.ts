import {
  SUBGRAPH_HOST,
  SUSHISWAP_V3_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'

import { Query, QueryResolvers } from '../../.graphclient/index.js'

const MAX_FIRST = 1000

export const poolsByTokenPair: QueryResolvers['poolsByTokenPair'] = async (
  root,
  args,
  context,
  info,
): Promise<Query['poolsByTokenPair']> => {
  const [chainId, tokenAddress0] = args.tokenId0.split(':')
  const [, tokenAddress1] = args.tokenId1.split(':')

  // Sorted on the factory contract
  const tokenAddresses = [tokenAddress0, tokenAddress1].sort()

  const fetch = (lastId: string) =>
    context.Concentrated.Query.CONCENTRATED_pools({
      root,
      args: {
        first: MAX_FIRST,
        where: {
          id_gt: lastId,
          token0: tokenAddresses[0],
          token1: tokenAddresses[1],
        },
        orderBy: 'id',
        orderDirection: 'asc',
      },
      context: {
        ...context,
        chainId: Number(chainId),
        subgraphName: SUSHISWAP_V3_SUBGRAPH_NAME[chainId],
        subgraphHost: SUBGRAPH_HOST[chainId],
      },
      info,
    })

  const data = []
  let lastId = ''
  for (;;) {
    const newData = await fetch(lastId)
    data.push(...newData)

    if (newData.length < MAX_FIRST) break

    lastId = newData[newData.length - 1].id
  }

  return data
}
