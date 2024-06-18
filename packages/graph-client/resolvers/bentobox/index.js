import { crossChainBentoBoxKpis } from './crossChainBentoBoxKpis.js';
import { crossChainStrategyKpis } from './crossChainStrategyKpis.js';
import { rebasesByChainIds } from './rebasesByChainIds.js';
export const resolvers = {
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
};
//# sourceMappingURL=index.js.map