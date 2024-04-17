// @ts-nocheck
import {
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_URL,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_URL
} from '@sushiswap/graph-config'
import { GraphQLResolveInfo } from 'graphql'
import { ChainId } from 'sushi/chain'

import {
  Query,
  QueryResolvers,
  QuerypairsByChainIdsArgs,
} from '../../.graphclient/index.js'
import { SushiSwapTypes } from '../../.graphclient/sources/SushiSwap/types.js'
import { TridentTypes } from '../../.graphclient/sources/Trident/types.js'

const BLACKLIST = {
  [ChainId.ARBITRUM]: [
    '0xb0f550f8b437ed614bb3105ab781c9428c40e8eb',
    '0xe74066750e339c8347d961c625f0ebbc64155b20',
    '0x82439e9471b724b595b4812ef5f5feac417b8131',
    '0xaa78062a0d632a453ab40f03d576a59350001f31',
    '0xe013d8ead448d9d3cf23eac40530c29ead8d0df5',
    '0xcc5caa099abe383ecb0d84ee37aafb0c50ae34ef',
    '0x6c8e8427db3c7825a60d3efedec3af7c472f99f4',
  ],
}

// An empty array breaks it
const getBlacklist = (chainId: ChainId, id_not_in?: string[]) =>
  BLACKLIST[chainId] ? [...(id_not_in ?? []), ...BLACKLIST[chainId]] : id_not_in

export const _pairsByChainIds = async (
  root = {},
  args: QuerypairsByChainIdsArgs,
  context: SushiSwapTypes.Context & TridentTypes.Context,
  info: GraphQLResolveInfo,
): Promise<Query['pairsByChainIds']> => {
  return Promise.all<Query['pairsByChainIds'][]>([
    ...args.chainIds
      .filter(
        (chainId): chainId is (typeof SUSHISWAP_ENABLED_NETWORKS)[number] =>
          SUSHISWAP_ENABLED_NETWORKS.includes(chainId),
      )
      .map((chainId) =>
        context.SushiSwap.Query.pairs({
          root,
          args: {
            ...args,
            where: args?.where?.type_in
              ? {
                ...args.where,
                type_in: args.where.type_in.filter(
                  (el) => el === 'CONSTANT_PRODUCT_POOL',
                ),
                id_not_in: getBlacklist(chainId, args?.where?.id_not_in),
              }
              : {
                ...args.where,
                id_not_in: getBlacklist(chainId, args?.where?.id_not_in),
              },
          },
          context: {
            ...context,
            chainId,
            url: SUSHISWAP_SUBGRAPH_URL[chainId],
          },
          info,
        }).then((pairs: SushiSwapTypes.Pair[]) => {
          if (!Array.isArray(pairs)) {
            console.error(`SushiSwap pairs query failed on ${chainId}`, pairs)
            return []
          }
          // console.debug(`SushiSwap pairs ${chainId}`, pairs)
          return pairs.map((pair) => ({ ...pair, chainId, address: pair.id }))
        }),
      ),
    ...args.chainIds
      .filter((chainId): chainId is (typeof TRIDENT_ENABLED_NETWORKS)[number] =>
        TRIDENT_ENABLED_NETWORKS.includes(chainId),
      )
      .map((chainId) =>
        context.Trident.Query.pairs({
          root,
          args: {
            ...args,
            where: {
              ...args.where,
              id_not_in: getBlacklist(chainId, args?.where?.id_not_in),
            },
          },
          context: {
            ...context,
            chainId,
            url: TRIDENT_SUBGRAPH_URL[chainId]
          },
          info,
        }).then((pairs: TridentTypes.Pair[]) => {
          if (!Array.isArray(pairs)) {
            console.error(`Trident pairs query failed on ${chainId}`, pairs)
            return []
          }
          // console.debug(`Trident pairs ${chainId}`, pairs)
          return pairs.map((pair) => ({ ...pair, chainId, address: pair.id }))
        }),
      ),
  ]).then((promise) => promise.flatMap((pairs) => pairs))
}

export const pairsByChainIds: QueryResolvers['pairsByChainIds'] = async (
  root,
  args,
  context,
  info,
): Promise<Query['pairsByChainIds']> => {
  return _pairsByChainIds(root, args, context, info)
}
