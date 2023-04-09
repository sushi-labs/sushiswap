import { SUBGRAPH_HOST, SUSHISWAP_SUBGRAPH_NAME, TRIDENT_SUBGRAPH_NAME } from '@sushiswap/graph-config'

import { QueryResolvers, Token } from '../../.graphclient'

export const tokenById: QueryResolvers['tokenById'] = async (root, args, context, info): Promise<Token> => {
  const [chainId, address] = args.id.split(':')

  const sushiSwapToken = await context.SushiSwap.Query.token(
    root,
    {
      ...args,
      id: address,
    },
    {
      ...context,
      chainId,
      subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId],
      subgraphHost: SUBGRAPH_HOST[chainId],
    },
    info
  )

  const tridentToken = await context.Trident.Query.token(
    root,
    {
      ...args,
      id: address,
    },
    {
      ...context,
      chainId,
      subgraphName: TRIDENT_SUBGRAPH_NAME[chainId],
      subgraphHost: SUBGRAPH_HOST[chainId],
    },
    info
  )

  // const bentoBoxToken = await context.BentoBox.Query.rebase(
  //   root,
  //   {
  //     ...args,
  //     id: address,
  //   },
  //   {
  //     ...context,
  //     chainId,
  //     subgraphName: BENTOBOX_SUBGRAPH_NAME[chainId],
  //     subgraphHost: SUBGRAPH_HOST[chainId],
  //   },
  //   info
  // )

  return {} as Token
}
