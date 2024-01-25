import {
  SUBGRAPH_HOST,
  SUSHISWAP_V3_ENABLED_NETWORKS,
  SUSHISWAP_V3_SUBGRAPH_NAME,
  SushiSwapV3ChainId,
} from '@sushiswap/graph-config'

import {
  Query,
  QueryResolvers,
  SUSHISWAP_V3_Factory,
} from '../../.graphclient/index.js'
import { isPromiseFulfilled } from 'sushi/validate'

export const v3factoriesByChainIds: QueryResolvers['v3factoriesByChainIds'] =
  async (
    root,
    args,
    context,
    info,
  ): Promise<Query['v3factoriesByChainIds']> => {
    return Promise.allSettled(
      args.chainIds
        .filter((chainId): chainId is SushiSwapV3ChainId =>
          SUSHISWAP_V3_ENABLED_NETWORKS.includes(chainId),
        )
        .map((chainId) => {
          return context.SushiSwapV3.Query.SUSHISWAP_V3_factories({
            root,
            args,
            context: {
              ...context,
              chainId,
              subgraphName: SUSHISWAP_V3_SUBGRAPH_NAME[chainId],
              subgraphHost: SUBGRAPH_HOST[chainId],
            },
            info,
          }).then((factories: SUSHISWAP_V3_Factory[]) => {
            return factories?.length > 0
            ? factories.map((factory) => ({
                ...factory,
                chainId,
              }))
            : []
          })
        }),
    ).then((promiseSettledResults) => {
      if (!Array.isArray(promiseSettledResults)) {
        console.error('v3 factories query failed...', promiseSettledResults)
        return []
      }
      return promiseSettledResults
        .flat()
        .filter(isPromiseFulfilled)
        .flatMap((promiseFulfilled) => promiseFulfilled.value)
    })
  }
