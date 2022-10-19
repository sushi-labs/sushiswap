import { CHAIN_NAME, KASHI_SUBGRAPH_HOST, KASHI_SUBGRAPH_NAME } from 'config'

import { KashiPair, QueryResolvers } from '.graphclient'

export const pairs: QueryResolvers['pairs'] = async (root, args, context, info) =>
  Promise.all(
    args.chainIds.map((chainId) =>
      context.Kashi.Query.kashiPairs({
        root,
        args,
        context: {
          ...context,
          chainId,
          chainName: CHAIN_NAME[chainId],
          subgraphName: KASHI_SUBGRAPH_NAME[chainId],
          subgraphHost: KASHI_SUBGRAPH_HOST[chainId],
        },
        info,
      }).then((pairs: KashiPair[]) =>
        pairs.map((pair) => ({
          ...pair,
          chainId,
          chainName: CHAIN_NAME[chainId],
        }))
      )
    )
  ).then((pairs) =>
    pairs
      .flat()
      .sort((a, b) => {
        if (args.orderDirection === 'asc') {
          return Number(a[args.orderBy || 'utilization']) - Number(b[args.orderBy || 'utilization'])
        } else if (args.orderDirection === 'desc') {
          return Number(b[args.orderBy || 'utilization']) - Number(a[args.orderBy || 'utilization'])
        }
        return 0
      })
      .slice(0, 10)
  )
