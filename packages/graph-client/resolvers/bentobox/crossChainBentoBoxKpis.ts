import { ChainId } from 'sushi/chain'
import { BentoBoxKpi, Resolvers } from '../../.graphclient/index.js'
import { BENTOBOX_SUBGRAPH_URL } from 'sushi/config/subgraph'

export const crossChainBentoBoxKpis: Resolvers['Query']['crossChainBentoBoxKpis'] =
  async (root, args, context, info) => {
    const supportedChainIds = args.chainIds
      .filter(
        (
          chainId,
        ): chainId is keyof typeof BENTOBOX_SUBGRAPH_URL &
          keyof typeof BENTOBOX_SUBGRAPH_URL =>
          chainId in BENTOBOX_SUBGRAPH_URL,
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
            url: BENTOBOX_SUBGRAPH_URL[chainId],
          },
          info,
        }).then((kpis: BentoBoxKpi[]) => {
          // We send chainId here so we can take it in the resolver above
          console.log(kpis, chainId)

          return kpis.map((kpi) => ({
            ...kpi,
            chainId,
          }))
        }),
      ),
    )

    return kpis.flat()
  }
