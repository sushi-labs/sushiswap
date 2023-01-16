import { Resolvers } from '../../.graphclient'
import { crossChainUserWithFarms } from './crossChainUserWithFarms'

export const resolvers: Resolvers = {
  Query: {
    crossChainUserWithFarms,
  },
}
