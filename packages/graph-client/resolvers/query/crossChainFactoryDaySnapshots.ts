import { chainName, chainShortName } from '@sushiswap/chain'
import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'

import { QueryResolvers } from '../../.graphclient'

export const crossChainFactoryDaySnapshots: QueryResolvers['crossChainFactoryDaySnapshots'] = async (
  root,
  args,
  context,
  info
) =>
  Promise.all([
    ...args.chainIds
      .filter((el) => TRIDENT_ENABLED_NETWORKS.includes(el))
      .map((chainId) =>
        context.Trident.Query.factoryDaySnapshots({
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
        }).then((snapshots) => {
          return snapshots.map((snapshot) => ({
            ...snapshot,
            chainId,
            chainName: chainName[chainId],
            chainShortName: chainShortName[chainId],
          }))
        })
      ),
    ...args.chainIds
      .filter((el) => SUSHISWAP_ENABLED_NETWORKS.includes(el))
      .map((chainId) =>
        context.SushiSwap.Query.factoryDaySnapshots({
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
        }).then((snapshots) => {
          if (!Array.isArray(snapshots)) {
            // console.log({ snapshots })
          }
          return snapshots.map((snapshot) => ({
            ...snapshot,
            chainId,
            chainName: chainName[chainId],
            chainShortName: chainShortName[chainId],
          }))
        })
      ),
  ]).then((snapshots) => snapshots.flat())
