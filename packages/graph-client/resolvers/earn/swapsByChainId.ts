import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'

import { EarnTypes } from '../../.graphclient/sources/Earn/types'
import { QueryResolvers } from '../../.graphclient'

export const swapsByChainId: QueryResolvers['swapsByChainId'] = async (root, args, context, info) => {
  return await context.Earn.Query.swaps({
      root,
      args,
      context: {
        ...context,
        subgraphName: SUSHISWAP_SUBGRAPH_NAME[args.chainId as typeof SUSHISWAP_ENABLED_NETWORKS[number]],
        subgraphHost: SUBGRAPH_HOST[args.chainId],
      },
      info
    }).then((swaps: EarnTypes.Swap[]) => {
      return swaps?.length > 0
        ? swaps.map((swap) => ({
            ...swap,
            chainId: args.chainId,
          }))
        : []
    }
  )
}
