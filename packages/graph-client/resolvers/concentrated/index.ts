import { Resolvers } from '../../.graphclient/index.js'
import { poolsByTokenPair } from './poolsByTokenPair.js'
import { ticksById } from './ticksById.js'

export const resolvers: Resolvers = {
  Query: {
    ticksById: ticksById,
    poolsByTokenPair: poolsByTokenPair,
  },
}
