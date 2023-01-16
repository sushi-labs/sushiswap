import { GraphQLResolveInfo } from 'graphql'

import { Query, QueryResolvers, QuerytokensByChainIdArgs } from '../../.graphclient'
import { SushiSwapTypes } from '../../.graphclient/sources/SushiSwap/types'
import { TridentTypes } from '../../.graphclient/sources/Trident/types'
import { _tokensByChainIds } from './tokensByChainIds'

export const _tokensByChainId = async (
  root = {},
  args: QuerytokensByChainIdArgs,
  context: SushiSwapTypes.Context & TridentTypes.Context,
  info: GraphQLResolveInfo
): Promise<Query['tokensByChainId']> => {
  return _tokensByChainIds(root, { ...args, chainIds: [args.chainId] }, context, info)
}

export const tokensByChainId: QueryResolvers['tokensByChainId'] = async (
  root,
  args,
  context,
  info
): Promise<Query['tokensByChainId']> => {
  return _tokensByChainId(root, args, context, info)
}
