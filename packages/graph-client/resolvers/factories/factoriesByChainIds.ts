// @ts-nocheck
import { isPromiseFulfilled } from 'sushi/validate'

import { Query, QueryResolvers, Resolvers } from '../../.graphclient/index.js'
import { SUSHISWAP_V2_SUBGRAPH_URL } from 'sushi/config/subgraph'
import { SUSHISWAP_V2_SUPPORTED_CHAIN_IDS } from 'sushi/config'

export const factoriesByChainIds: QueryResolvers['factoriesByChainIds'] =
  async (root, args, context, info): Promise<Query['factoriesByChainIds']> => {
    return Promise.allSettled<Query['factoriesByChainIds'][]>([
      ...args.chainIds
        .filter((el): el is (typeof SUSHISWAP_SUPPORTED_CHAIN_IDS)[number] =>
          SUSHISWAP_V2_SUPPORTED_CHAIN_IDS.includes(el),
        )
        .map((chainId) =>
          context.SushiSwapV2.Query.uniswapFactories({
            root,
            args,
            context: {
              ...context,
              chainId,
              url: SUSHISWAP_V2_SUBGRAPH_URL[chainId],
            },
            info,
          }).then((factories: Factory[]) => {
            return factories?.length > 0
              ? factories.map((factory) => ({
                  ...factory,
                  chainId,
                }))
              : []
          }),
        ),
    ]).then((promiseSettledResults) => {
      if (!Array.isArray(promiseSettledResults)) {
        console.error('factories query failed...', promiseSettledResults)
        return []
      }
      return promiseSettledResults
        .flat()
        .filter(isPromiseFulfilled)
        .flatMap((promiseFulfilled) => promiseFulfilled.value)
    })
  }

export const resolvers: Resolvers = {
  UniswapFactory: {
    chainId: (root, args, context, info) =>
      Number(root.chainId || context.chainId || 1),
  },
  Query: {
    factoriesByChainIds,
  },
}
