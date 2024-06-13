import { poolsByTokenPair } from './poolsByTokenPair.js';
import { ticksById } from './ticksById.js';
import { v3factoriesByChainIds } from './v3factoriesByChainIds.js';
export const resolvers = {
    Query: {
        v3factoriesByChainIds: v3factoriesByChainIds,
        ticksById: ticksById,
        poolsByTokenPair: poolsByTokenPair,
    },
};
//# sourceMappingURL=index.js.map