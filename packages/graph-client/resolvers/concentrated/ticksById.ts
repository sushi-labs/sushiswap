import {
  CONCENTRATED_SUBGRAPH_NAME,
  SUBGRAPH_HOST,
} from '@sushiswap/graph-config'

import { Query, QueryResolvers } from '../../.graphclient/index.js'

const MAX_FIRST = 1000

export const ticksById: QueryResolvers['ticksById'] = async (
  root,
  args,
  context,
  info,
): Promise<Query['ticksById']> => {
  const [chainId, poolAddress] = args.id.split(':')

  const fetch = (lastId: string) =>
    context.Concentrated.Query.CONCENTRATED_ticks({
      root,
      args: {
        first: MAX_FIRST,
        where: {
          id_gt: lastId,
          pool: poolAddress,
        },
        orderBy: 'id',
        orderDirection: 'asc',
      },
      context: {
        ...context,
        chainId: Number(chainId),
        subgraphName: CONCENTRATED_SUBGRAPH_NAME[chainId],
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
