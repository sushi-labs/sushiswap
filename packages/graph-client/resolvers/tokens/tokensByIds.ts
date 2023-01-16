import { QueryResolvers, Token } from '../../.graphclient'

export const tokensByIds: QueryResolvers['tokensByIds'] = async (root, args, context, info): Promise<Token[]> => {
  return [] as Token[]
}
