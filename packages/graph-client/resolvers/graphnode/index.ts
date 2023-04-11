import { Resolvers } from '../../.graphclient/index.js'
import { subgraphs } from './subgraphs.js'

export const resolvers: Resolvers = {
  Query: {
    subgraphs,
  },
}
