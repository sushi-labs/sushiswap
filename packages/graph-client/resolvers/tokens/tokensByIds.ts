import { QueryResolvers, Token } from '../../.graphclient/index.js'

export const tokensByIds: QueryResolvers['tokensByIds'] = async (
  root,
  args,
  context,
  info,
): Promise<Token[]> => {
  return [] as Token[]
}
