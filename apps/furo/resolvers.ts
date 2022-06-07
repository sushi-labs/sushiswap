import { Resolvers } from '.graphclient'

export const resolvers: Resolvers = {
  Pair: {
    chainId: (root, args, context: any, info) => context.chainId || '1', // The value we provide in the config
  },
}
