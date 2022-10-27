import { Resolvers } from '../../.graphclient'
import { crossChainFuroTokens } from './query/furo'

export const resolvers: Resolvers = {
  Query: {
    crossChainFuroTokens,
  },
}
