import { Pair, QueryResolvers } from '../../.graphclient'

export const pairsByIds: QueryResolvers['pairsByIds'] = async (root, args, context, info): Promise<Pair[]> => {
  return [] as Pair[]
}
