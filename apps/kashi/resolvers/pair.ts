import { chainName, chainShortName } from '@sushiswap/chain'
import { KASHI_SUBGRAPH_HOST, KASHI_SUBGRAPH_NAME } from 'config'

import { QueryResolvers } from '.graphclient'

export const pair: QueryResolvers['pair'] = async (root, args, context, info) =>
  context.Kashi.Query.kashiPair({
    root,
    args,
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
  }).then((pool) => ({
    ...pool,
    id: `${chainShortName[args.chainId]}:${pool.id}`,
    address: pool.id,
    chainId: args.chainId,
    chainName: chainName[args.chainId],
    chainShortName: chainShortName[args.chainId],
  }))
