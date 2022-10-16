import { chainName, chainShortName } from '@sushiswap/chain'
import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'

import { QueryResolvers } from '../../.graphclient'
import { page } from '../../functions'

export const crossChainTokens: QueryResolvers['crossChainTokens'] = async (root, args, context, info) => {
  return Promise.all([
    ...args.chainIds
      .filter((el) => TRIDENT_ENABLED_NETWORKS.includes(el))
      .map((chainId) =>
        context.Trident.Query.tokens({
          root,
          args,
          context: {
            ...context,
            chainId,
            chainName: chainName[chainId],
            chainShortName: chainShortName[chainId],
            subgraphName: TRIDENT_SUBGRAPH_NAME[chainId],
            subgraphHost: SUBGRAPH_HOST[chainId],
          },
          info,
        }).then((tokens) => {
          return tokens?.length > 0
            ? tokens.map((token) => ({
                ...token,
                id: `${chainShortName[chainId]}:${token.id}`,
                chainId,
                chainName: chainName[chainId],
                chainShortName: chainShortName[chainId],
                source: 'TRIDENT',
              }))
            : []
        })
      ),
    ...args.chainIds
      .filter((el) => SUSHISWAP_ENABLED_NETWORKS.includes(el))
      .map((chainId) =>
        context.SushiSwap.Query.tokens({
          root,
          args,
          context: {
            ...context,
            chainId,
            chainName: chainName[chainId],
            chainShortName: chainShortName[chainId],
            subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId],
            subgraphHost: SUBGRAPH_HOST[chainId],
          },
          info,
        }).then((tokens) => {
          return tokens?.length > 0
            ? tokens.map((token) => ({
                ...token,
                id: `${chainShortName[chainId]}:${token.id}`,
                chainId,
                chainName: chainName[chainId],
                chainShortName: chainShortName[chainId],
                source: 'LEGACY',
              }))
            : []
        })
      ),
  ])
    .then((pools) =>
      pools.flat().sort((a, b) => {
        if (args.orderDirection === 'asc') {
          return a[args.orderBy || 'apr'] - b[args.orderBy || 'apr']
        } else if (args.orderDirection === 'desc') {
          return b[args.orderBy || 'apr'] - a[args.orderBy || 'apr']
        }
        return 0
      })
    )
    .then((pools) => page(pools, args.pagination))
}
