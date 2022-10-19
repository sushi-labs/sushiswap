import { chainName, chainShortName } from '@sushiswap/chain'
import { KASHI_SUBGRAPH_HOST, KASHI_SUBGRAPH_NAME } from 'config'

import { KashiPair, QueryResolvers } from '.graphclient'

export const pair: QueryResolvers['pair'] = async (root, args, context, info) => {
  console.log({ args })
  return context.Kashi.Query.kashiPair({
    root,
    args: {
      ...args,
      id: args.id.toLowerCase(),
    },
    context: {
      ...context,
      now: args.now,
      chainId: args.chainId,
      chainName: chainName[args.chainId],
      chainShortName: chainShortName[args.chainId],
      subgraphName: KASHI_SUBGRAPH_NAME[args.chainId],
      subgraphHost: KASHI_SUBGRAPH_HOST[args.chainId],
    },
    info,
  }).then((pair: KashiPair) => {
    return {
      ...pair,
      // id: `${chainShortName[args.chainId]}:${pair.id}`,
      address: pair.id,
      chainId: args.chainId,
      chainName: chainName[args.chainId],
      chainShortName: chainShortName[args.chainId],
    }
  })
}
