import { GraphQLResolveInfo } from 'graphql'

import { Query, QuerypairsByChainIdArgs, QueryResolvers } from '../../.graphclient'
import { SushiSwapTypes } from '../../.graphclient/sources/SushiSwap/types'
import { TridentTypes } from '../../.graphclient/sources/Trident/types'
import { _pairsByChainIds } from './pairsByChainIds'

export const _pairsByChainId = async (
  root = {},
  args: QuerypairsByChainIdArgs,
  context: SushiSwapTypes.Context & TridentTypes.Context,
  info: GraphQLResolveInfo
): Promise<Query['pairsByChainId']> => {
  return _pairsByChainIds(root, { ...args, chainIds: [args.chainId] }, context, info)
}

export const pairsByChainId: QueryResolvers['pairsByChainId'] = async (
  root,
  args,
  context,
  info
): Promise<Query['pairsByChainId']> => {
  return _pairsByChainId(root, args, context, info)
}
