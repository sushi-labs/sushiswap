import { Resolvers } from '../../.graphclient/index.js'
import { crossChainToken } from './crossChainToken.js'

export const resolvers: Resolvers = {
  Query: {
    crossChainToken,
  },
}
