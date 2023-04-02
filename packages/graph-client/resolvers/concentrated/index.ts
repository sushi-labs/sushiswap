import { Resolvers } from '../../.graphclient'
import { poolsByTokenPair } from './poolsByTokenPair'
import { ticksById } from './ticksById'

export const resolvers: Resolvers = {
  Query: {
    ticksById: ticksById,
    poolsByTokenPair: poolsByTokenPair,
  },
}
