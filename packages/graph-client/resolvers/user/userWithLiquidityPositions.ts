import { SUSHISWAP_ENABLED_NETWORKS, TRIDENT_ENABLED_NETWORKS } from '@sushiswap/graph-config'

import { getBuiltGraphSDK, QueryResolvers } from '../../.graphclient'

const sdk = getBuiltGraphSDK()

export const userWithLiquidityPositions: QueryResolvers['userWithLiquidityPositions'] = async (
  root,
  args,
  context,
  info
) => {
  const liquidityPositions = await sdk.LiquidityPositions({
    chainIds: Array.from(new Set([...SUSHISWAP_ENABLED_NETWORKS, ...TRIDENT_ENABLED_NETWORKS])),
    where: { user: args.id },
  })
  return {
    id: args.id,
    liquidityPositions,
  }
}
