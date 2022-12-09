import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'

import { EarnTypes } from '../../.graphclient/sources/Earn/types'
import { QueryResolvers } from '../../.graphclient'

export const burnsByChainId: QueryResolvers['burnsByChainId'] = async (root, args, context, info) => {
  return await context.Earn.Query.burns({
      root,
      args,
      context: {
        ...context,
        subgraphName: SUSHISWAP_SUBGRAPH_NAME[args.chainId as typeof SUSHISWAP_ENABLED_NETWORKS[number]],
        subgraphHost: SUBGRAPH_HOST[args.chainId],
      },
      info
    }).then((burns: EarnTypes.Burn[]) => {
      return burns?.length > 0
        ? burns.map((burn) => ({
            ...burn,
            chainId: args.chainId,
          }))
        : []
    }
  )
}