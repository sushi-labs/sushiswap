import { Resolvers } from '../../.graphclient'
import { subgraphs } from './subgraphs'

export const resolvers: Resolvers = {
  Query: {
    subgraphs,
  },
}
