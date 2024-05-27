// @ts-nocheck
import { GraphQLResolveInfo } from 'graphql'
import { ChainId, chainName, chainShortName } from 'sushi/chain'

import {
  Query,
  QueryResolvers,
  QuerytokensByChainIdsArgs,
  Token,
} from '../../.graphclient/index.js'
import { SushiSwapV2Types } from '../../.graphclient/sources/SushiSwap/types.js'
import { page } from '../../lib/page.js'
import { SUSHISWAP_V2_SUPPORTED_CHAIN_IDS } from 'sushi/config'
import { SUSHISWAP_V2_SUBGRAPH_URL } from 'sushi/config/subgraph'

const BLACKLIST = {
  [ChainId.ARBITRUM]: ['0xeba61eb686b515fae79a96118f140924a634ab23'],
}

// An empty array breaks it
const getBlacklist = (chainId: ChainId, id_not_in?: string[]) =>
  BLACKLIST[chainId] ? [...(id_not_in ?? []), ...BLACKLIST[chainId]] : id_not_in

export const _tokensByChainIds = async (
  root = {},
  args: QuerytokensByChainIdsArgs,
  context: SushiSwapV2Types.Context,
  info: GraphQLResolveInfo,
): Promise<Query['tokensByChainIds']> => {
  // @ts-ignore
  return Promise.all<Query['tokensByChainIds'][]>([
    ...args.chainIds
      .filter((el) => SUSHISWAP_V2_SUPPORTED_CHAIN_IDS.includes(el))
      .map((chainId: (typeof SUSHISWAP_V2_SUPPORTED_CHAIN_IDS)[number]) =>
        context.SushiSwapV2.Query.tokens({
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
            url: SUSHISWAP_V2_SUBGRAPH_URL[chainId],
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
