import { Resolvers } from '../../.graphclient'
import { crossChainUserPositions } from './crossChainUserPositions'

export const resolvers: Resolvers = {
  Query: {
    crossChainUserPositions,
  },
}
