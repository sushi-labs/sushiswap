import {
  SUSHISWAP_V3_ENABLED_NETWORKS,
  SUSHISWAP_V3_SUBGRAPH_URL,
  SushiSwapV3ChainId
} from '@sushiswap/graph-config'

import { isPromiseFulfilled } from 'sushi/validate'
import {
  Query,
  QueryResolvers,
  SUSHISWAP_V3_Factory,
} from '../../.graphclient/index.js'

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
              url: SUSHISWAP_V3_SUBGRAPH_URL[chainId]
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
