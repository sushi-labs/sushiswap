import { Resolvers } from '../../.graphclient/index.js'

import { poolsByTokenPair } from './poolsByTokenPair.js'
import { v3factoriesByChainIds } from './v3factoriesByChainIds.js'

export const resolvers: Resolvers = {
  Query: {
    v3factoriesByChainIds: v3factoriesByChainIds,
    poolsByTokenPair: poolsByTokenPair,
  },
}
