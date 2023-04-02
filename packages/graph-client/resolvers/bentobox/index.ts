import { Resolvers } from '../../.graphclient'
import { crossChainBentoBoxKpis } from './crossChainBentoBoxKpis'
import { crossChainStrategyKpis } from './crossChainStrategyKpis'
import { rebasesByChainIds } from './rebasesByChainIds'

export const resolvers: Resolvers = {
  BentoBoxKpi: {
    chainId: (root, args, context) => root.chainId || context.chainId || 137,
  },
  StrategyKpi: {
    chainId: (root, args, context) => root.chainId || context.chainId || 137,
  },
  Rebase: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Query: {
    rebasesByChainIds,
    crossChainBentoBoxKpis,
    crossChainStrategyKpis,
  },
}
