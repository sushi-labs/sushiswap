import { BENTOBOX_SUBGRAPH_HOST, BENTOBOX_SUBGRAPH_NAME } from 'config'

import { Resolvers } from '.graphclient'

export const resolvers: Resolvers = {
  BentoBoxKpi: {
    chainId: (root, args, context, info) => root.chainId || context.chainId || 137,
  },
  StrategyKpi: {
    chainId: (root, args, context, info) => root.chainId || context.chainId || 137,
  },
  Query: {
    crossChainBentoBoxKpis: async (root, args, context, info) =>
      Promise.all(
        args.chainIds.map((chainId) =>
          context.BentoBox.Query.bentoBoxKpis({
            root,
            args,
            context: {
              ...context,
              chainId,
              name: BENTOBOX_SUBGRAPH_NAME[chainId],
              host: BENTOBOX_SUBGRAPH_HOST[chainId],
            },
            info,
          }).then((kpis) =>
            // We send chainId here so we can take it in the resolver above
            kpis.map((kpi) => ({
              ...kpi,
              chainId,
            }))
          )
        )
      ).then((kpis) => kpis.flat()),
    crossChainStrategyKpis: async (root, args, context, info) =>
      Promise.all(
        args.chainIds.map((chainId) =>
          context.BentoBox.Query.strategyKpis({
            root,
            args,
            context: {
              ...context,
              chainId,
              name: BENTOBOX_SUBGRAPH_NAME[chainId],
              host: BENTOBOX_SUBGRAPH_HOST[chainId],
            },
            info,
          }).then((kpis) =>
            kpis.map((kpi) => ({
              ...kpi,
              chainId,
            }))
          )
        )
      ).then((kpis) => kpis.flat()),
  },
}
