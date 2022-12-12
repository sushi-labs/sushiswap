import { SUBGRAPH_HOST, SUSHISWAP_ENABLED_NETWORKS, SUSHISWAP_SUBGRAPH_NAME } from '@sushiswap/graph-config'

import { EarnTypes } from '../../.graphclient/sources/Earn/types'
import { QueryResolvers } from '../../.graphclient'

export const mintsByChainId: QueryResolvers['mintsByChainId'] = async (root, args, context, info) => {
  return await context.Earn.Query.mints({
    root,
    args,
    context: {
      ...context,
      subgraphName: SUSHISWAP_SUBGRAPH_NAME[args.chainId as typeof SUSHISWAP_ENABLED_NETWORKS[number]],
      subgraphHost: SUBGRAPH_HOST[args.chainId as typeof SUSHISWAP_ENABLED_NETWORKS[number]],
    },
    info,
  }).then((mints: EarnTypes.Mint[]) => {
    return mints?.length > 0
      ? mints.map((mint) => ({
          ...mint,
          chainId: args.chainId,
        }))
      : []
  })
}
