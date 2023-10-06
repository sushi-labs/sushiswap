import { BENTOBOX_SUBGRAPH_NAME, SUBGRAPH_HOST } from '@sushiswap/graph-config'

import { BentoBoxKpi, Resolvers } from '../../.graphclient/index.js'
import { ChainId } from 'sushi/chain'

export const crossChainBentoBoxKpis: Resolvers['Query']['crossChainBentoBoxKpis'] = async (
  root,
  args,
  context,
  info
) => {
  const supportedChainIds = args.chainIds
    .filter(
      (chainId): chainId is keyof typeof BENTOBOX_SUBGRAPH_NAME & keyof typeof SUBGRAPH_HOST =>
        chainId in BENTOBOX_SUBGRAPH_NAME
    )
    // Kava subgraph doesn't have the bentoBoxKpis query
    .filter((chainId) => chainId !== ChainId.KAVA)

  const kpis = await Promise.all(
    supportedChainIds.map((chainId) =>
      context.BentoBox.Query.bentoBoxKpis({
        root,
        args,
        context: {
          ...context,
          chainId,
          subgraphName: BENTOBOX_SUBGRAPH_NAME[chainId],
          subgraphHost: SUBGRAPH_HOST[chainId],
        },
        info,
      }).then((kpis: BentoBoxKpi[]) => {
        // We send chainId here so we can take it in the resolver above
        console.log(kpis, chainId)

        return kpis.map((kpi) => ({
          ...kpi,
          chainId,
        }))
      })
    )
  )

  return kpis.flat()
}
