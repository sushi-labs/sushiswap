// @ts-nocheck
import { SUSHISWAP_V2_SUBGRAPH_URL } from 'sushi/config/subgraph'
import { Bundle, Query, QueryResolvers } from '../../.graphclient/index.js'
import { SUSHISWAP_V2_SUPPORTED_CHAIN_IDS } from 'node_modules/sushi/dist/config/sushiswap-v2.js'

export const bundlesByChainIds: QueryResolvers['bundlesByChainIds'] = async (
  root,
  args,
  context,
  info,
) => {
  return Promise.all<Query['bundlesByChainIds']>([
    ...args.chainIds
      .filter((el): el is (typeof SUSHISWAP_V2_SUPPORTED_CHAIN_IDS)[number] =>
        SUSHISWAP_V2_SUPPORTED_CHAIN_IDS.includes(el),
      )
      .map((chainId) =>
        context.SushiSwapV2.Query.bundles({
          root,
          args,
          context: {
            ...context,
            chainId,
            url: SUSHISWAP_V2_SUBGRAPH_URL[chainId],
          },
          info,
        }).then((bundles: Bundle[]) =>
          bundles?.length > 0
            ? bundles.map((bundle) => ({
                ...bundle,
                chainId,
              }))
            : [],
        ),
      ),
  ]).then((bundles) => bundles.flat())
}
