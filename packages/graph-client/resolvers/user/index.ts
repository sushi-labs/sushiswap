import { Resolvers } from '../../.graphclient/index.js'
import { crossChainUserPositions } from './crossChainUserPositions.js'

export const resolvers: Resolvers = {
  Query: {
    crossChainUserPositions,
  },
}
