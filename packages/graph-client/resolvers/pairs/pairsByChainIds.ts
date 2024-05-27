// @ts-nocheck
import { GraphQLResolveInfo } from 'graphql'
import { ChainId } from 'sushi/chain'

import {
  Query,
  QueryResolvers,
  QuerypairsByChainIdsArgs,
} from '../../.graphclient/index.js'
import { SushiSwapV2Types } from '../../.graphclient/sources/SushiSwap/types.js'
import { SUSHISWAP_V2_SUPPORTED_CHAIN_IDS } from 'sushi/config'
import { SUSHISWAP_V2_SUBGRAPH_URL } from 'sushi/config/subgraph'

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
  context: SushiSwapV2Types.Context,
  info: GraphQLResolveInfo,
): Promise<Query['pairsByChainIds']> => {
  return Promise.all<Query['pairsByChainIds'][]>([
    ...args.chainIds
      .filter(
        (
          chainId,
        ): chainId is (typeof SUSHISWAP_V2_SUPPORTED_CHAIN_IDS)[number] =>
          SUSHISWAP_V2_SUPPORTED_CHAIN_IDS.includes(chainId),
      )
      .map((chainId) =>
        context.SushiSwapV2.Query.pairs({
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
            url: SUSHISWAP_V2_SUBGRAPH_URL[chainId],
          },
          info,
        }).then((pairs: SushiSwapV2Types.Pair[]) => {
          if (!Array.isArray(pairs)) {
            console.error(`SushiSwap pairs query failed on ${chainId}`, pairs)
            return []
          }
          // console.debug(`SushiSwap pairs ${chainId}`, pairs)
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
