import { Resolvers } from '../../.graphclient'
import { swapsByChainId } from './swapsByChainId'
import { mintsByChainId } from './mintsByChainId'
import { burnsByChainId } from './burnsByChainId'

export const resolvers: Resolvers = {
  Query: {
    swapsByChainId,
    mintsByChainId,
    burnsByChainId,
  },
}
