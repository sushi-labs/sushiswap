import { Pair, QueryResolvers } from '../../.graphclient/index.js'

export const pairsByIds: QueryResolvers['pairsByIds'] = async (
  root,
  args,
  context,
  info,
): Promise<Pair[]> => {
  return [] as Pair[]
}
