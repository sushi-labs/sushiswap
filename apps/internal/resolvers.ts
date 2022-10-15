import { BENTOBOX_SUBGRAPH_NAME, SUBGRAPH_HOST } from '@sushiswap/graph-config'

import { Resolvers, SubgraphStatus } from '.graphclient'
import { getBuiltGraphSDK } from '.graphclient'

export const resolvers: Resolvers = {
  BentoBoxKpi: {
    chainId: (root, args, context) => root.chainId || context.chainId || 137,
  },
  StrategyKpi: {
    chainId: (root, args, context) => root.chainId || context.chainId || 137,
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
    subgraphs: async (root, args) => {
      const sdk = getBuiltGraphSDK()

      const fetch = async (subgraphName: string) => {
        switch (args.type) {
          case 'Current': {
            return sdk.CurrentSubgraphIndexingStatus({ subgraphName })
          }
          case 'Pending': {
            return sdk.PendingSubgraphIndexingStatus({ subgraphName })
          }
        }
      }

      return (
        await Promise.all(
          args.subgraphNames.map(async (subgraphName) =>
            fetch(subgraphName).then((statusObject) => {
              const data = Object.values(statusObject)[0]

              if (!data) return undefined
              const hasFailed = data.fatalError?.message ? true : false
              const status: SubgraphStatus = hasFailed
                ? 'Failed'
                : data.chains[0].chainHeadBlock.number - data.chains[0].latestBlock.number <= 50
                ? 'Synced'
                : 'Syncing'

              return {
                subgraphName,
                subgraphId: data.subgraph,
                type: args.type,
                status,
                startBlock: data.chains[0].earliestBlock.number as number,
                lastSyncedBlock: data.chains[0].latestBlock.number as number,
                chainHeadBlock: data.chains[0].chainHeadBlock.number as number,
                hasFailed,
                nonFatalErrorCount: data.nonFatalErrors.length,
                entityCount: data.entityCount as number,
              }
            })
          )
        )
      ).filter(Boolean)
    },
  },
}
