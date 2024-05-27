import { GraphQLResolveInfo } from 'graphql'

import {
  Query,
  QueryResolvers,
  QuerytokensByChainIdArgs,
} from '../../.graphclient/index.js'
import { SushiSwapV2Types } from '../../.graphclient/sources/SushiSwapV2/types.js'
import { _tokensByChainIds } from './tokensByChainIds.js'

export const _tokensByChainId = async (
  root = {},
  args: QuerytokensByChainIdArgs,
  context: SushiSwapV2Types.Context,
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
