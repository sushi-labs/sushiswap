// @ts-nocheck
import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'
import { GraphQLResolveInfo } from 'graphql'
import { ChainId, chainName, chainShortName } from 'sushi/chain'

import {
  Query,
  QueryResolvers,
  QuerytokensByChainIdsArgs,
  Token,
} from '../../.graphclient/index.js'
import { SushiSwapTypes } from '../../.graphclient/sources/SushiSwap/types.js'
import { TridentTypes } from '../../.graphclient/sources/Trident/types.js'
import { page } from '../../lib/page.js'

const BLACKLIST = {
  [ChainId.ARBITRUM]: ['0xeba61eb686b515fae79a96118f140924a634ab23'],
}

// An empty array breaks it
const getBlacklist = (chainId: ChainId, id_not_in?: string[]) =>
  BLACKLIST[chainId] ? [...(id_not_in ?? []), ...BLACKLIST[chainId]] : id_not_in

export const _tokensByChainIds = async (
  root = {},
  args: QuerytokensByChainIdsArgs,
  context: SushiSwapTypes.Context & TridentTypes.Context,
  info: GraphQLResolveInfo,
): Promise<Query['tokensByChainIds']> => {
  // @ts-ignore
  return Promise.all<Query['tokensByChainIds'][]>([
    ...args.chainIds
      .filter((el) => TRIDENT_ENABLED_NETWORKS.includes(el))
      .map((chainId: typeof TRIDENT_ENABLED_NETWORKS[number]) =>
        context.Trident.Query.tokens({
          root,
          // @ts-ignore
          args: {
            ...args,
            where: {
              ...args.where,
              id_not_in: getBlacklist(chainId, args?.where?.id_not_in),
            },
          },
          context: {
            ...context,
            // @ts-ignore
            chainId,
            chainName: chainName[chainId],
            chainShortName: chainShortName[chainId],
            subgraphName: TRIDENT_SUBGRAPH_NAME[chainId],
            subgraphHost: SUBGRAPH_HOST[chainId],
          },
          info,
          // @ts-ignore
        }).then((tokens: Token[]) => {
          if (!Array.isArray(tokens)) {
            console.error(`Trident tokens query failed on ${chainId}`, tokens)
            return []
          }
          return tokens.length > 0
            ? tokens.map((token) => ({
                ...token,
                id: `${chainShortName[chainId]}:${token.id}`,
                chainId,
                chainName: chainName[chainId],
                chainShortName: chainShortName[chainId],
                source: 'TRIDENT',
              }))
            : []
        }),
      ),
    ...args.chainIds
      .filter((el) => SUSHISWAP_ENABLED_NETWORKS.includes(el))
      .map((chainId: typeof SUSHISWAP_ENABLED_NETWORKS[number]) =>
        context.SushiSwap.Query.tokens({
          root,
          // @ts-ignore
          args: {
            ...args,
            where: {
              ...args.where,
              id_not_in: getBlacklist(chainId, args?.where?.id_not_in),
            },
          },
          context: {
            ...context,
            // @ts-ignore
            chainId,
            chainName: chainName[chainId],
            chainShortName: chainShortName[chainId],
            subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId],
            subgraphHost: SUBGRAPH_HOST[chainId],
          },
          info,
          // @ts-ignore
        }).then((tokens: Token[]) => {
          if (!Array.isArray(tokens)) {
            console.error(`SushiSwap tokens query failed on ${chainId}`, tokens)
            return []
          }

          return tokens.length > 0
            ? tokens.map((token) => ({
                ...token,
                id: `${chainShortName[chainId]}:${token.id}`,
                chainId,
                chainName: chainName[chainId],
                chainShortName: chainShortName[chainId],
                source: 'LEGACY',
              }))
            : []
        }),
      ),
  ]).then((value) =>
    page(
      value.flat().sort((a, b) => {
        if (args.orderDirection === 'asc') {
          return (
            a[args.orderBy || 'liquidityUSD'] -
            b[args.orderBy || 'liquidityUSD']
          )
        } else if (args.orderDirection === 'desc') {
          return (
            b[args.orderBy || 'liquidityUSD'] -
            a[args.orderBy || 'liquidityUSD']
          )
        }
        return 0
      }),
      args.pagination,
    ),
  )
}

export const tokensByChainIds: QueryResolvers['tokensByChainIds'] = async (
  root,
  args,
  context,
  info,
) => {
  return _tokensByChainIds(root, args, context, info)
}
