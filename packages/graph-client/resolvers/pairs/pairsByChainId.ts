import { GraphQLResolveInfo } from 'graphql'

import {
  Query,
  QueryResolvers,
  QuerypairsByChainIdArgs,
} from '../../.graphclient/index.js'
import { SushiSwapV2Types } from '../../.graphclient/sources/SushiSwapV2/types.js'
import { _pairsByChainIds } from './pairsByChainIds.js'

export const _pairsByChainId = async (
  root = {},
  args: QuerypairsByChainIdArgs,
  context: SushiSwapV2Types.Context,
  info: GraphQLResolveInfo,
): Promise<Query['pairsByChainId']> => {
  return _pairsByChainIds(
    root,
    { ...args, chainIds: [args.chainId] },
    context,
    info,
  )
}

export const pairsByChainId: QueryResolvers['pairsByChainId'] = async (
  root,
  args,
  context,
  info,
): Promise<Query['pairsByChainId']> => {
  return _pairsByChainId(root, args, context, info)
}
