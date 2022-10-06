import { BENTOBOX_SUBGRAPH_NAME, SUBGRAPH_HOST } from '@sushiswap/graph-config'

import { Resolvers } from '.graphclient'
import { getBuiltGraphSDK } from '.graphclient'

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
              host: SUBGRAPH_HOST[chainId],
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
              host: SUBGRAPH_HOST[chainId],
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
    subgraphStatuses: async (root, args, context, info) =>
      Promise.all(
        args.subgraphNames.map(async (subgraphName) => {
          const sdk = getBuiltGraphSDK()

          return sdk.SubgraphIndexingStatus({ subgraphName }).then(({ indexingStatusForCurrentVersion: status }) => ({
            subgraphName,
            startBlock: status.chains[0].earliestBlock.number,
            lastSyncedBlock: status.chains[0].latestBlock.number,
            chainHeadBlock: status.chains[0].chainHeadBlock.number,
            hasFailed: status.fatalError?.message ? true : false,
            nonFatalErrorCount: status.nonFatalErrors.length,
            entityCount: status.entityCount,
          }))
        })
      ),
  },
}
