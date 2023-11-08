import { GraphQLResolveInfo } from 'graphql'

import {
  Query,
  QueryResolvers,
  QuerytokensByChainIdArgs,
} from '../../.graphclient/index.js'
import { SushiSwapTypes } from '../../.graphclient/sources/SushiSwap/types.js'
import { TridentTypes } from '../../.graphclient/sources/Trident/types.js'
import { _tokensByChainIds } from './tokensByChainIds.js'

export const _tokensByChainId = async (
  root = {},
  args: QuerytokensByChainIdArgs,
  context: SushiSwapTypes.Context & TridentTypes.Context,
  info: GraphQLResolveInfo,
): Promise<Query['tokensByChainId']> => {
  return _tokensByChainIds(
    root,
    { ...args, chainIds: [args.chainId] },
    context,
    info,
  )
}

export const tokensByChainId: QueryResolvers['tokensByChainId'] = async (
  root,
  args,
  context,
  info,
): Promise<Query['tokensByChainId']> => {
  return _tokensByChainId(root, args, context, info)
}
