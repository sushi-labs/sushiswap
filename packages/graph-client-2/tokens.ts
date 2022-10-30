import { Resolvers } from './.graphclient'

export const resolvers: Resolvers = {
  Token: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Query: {},
}
