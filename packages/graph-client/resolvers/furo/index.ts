import { Resolvers } from '../../.graphclient/index.js'
import { furoTokensByChainIds } from './tokensByChainIds.js'

export const resolvers: Resolvers = {
  Query: {
    furoTokensByChainIds,
  },
}
