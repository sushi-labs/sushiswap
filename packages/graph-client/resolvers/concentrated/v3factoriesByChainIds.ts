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

export const v3factoriesByChainIds: QueryResolvers['v3factoriesByChainIds'] =
  async (
    root,
    args,
    context,
    info,
  ): Promise<Query['v3factoriesByChainIds']> => {
    const fetchFactory = async (
      chainId: SushiSwapV3ChainId,
    ): Promise<SUSHISWAP_V3_Factory> => {
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
      }).then((factories: SUSHISWAP_V3_Factory[]) => ({
        ...factories[0],
        chainId,
      }))
    }

    const factories = await Promise.allSettled(
      args.chainIds
        .filter((chainId): chainId is SushiSwapV3ChainId =>
          SUSHISWAP_V3_ENABLED_NETWORKS.includes(chainId),
        )
        .map((chainId) => fetchFactory(chainId)),
    )

    return factories
      .map((settlement) =>
        settlement.status === 'fulfilled' ? settlement.value : null,
      )
      .filter((factory): factory is SUSHISWAP_V3_Factory => factory !== null)
  }
