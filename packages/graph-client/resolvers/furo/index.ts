import { Resolvers } from '../../.graphclient'
import { furoTokensByChainIds } from './tokensByChainIds'

export const resolvers: Resolvers = {
  Query: {
    furoTokensByChainIds,
  },
}
