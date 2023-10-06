// @ts-nocheck

import { ChainId, chainName } from 'sushi/chain'
import {
  MASTERCHEF_V1_SUBGRAPH_NAME,
  MASTERCHEF_V2_SUBGRAPH_NAME,
  MINICHEF_SUBGRAPH_NAME,
  SUBGRAPH_HOST,
} from '@sushiswap/graph-config'
import { isPromiseFulfilled } from 'sushi'

import { Query, QueryResolvers, Resolvers } from '../../.graphclient/index.js'

export const crossChainChefUser: QueryResolvers['crossChainChefUser'] = async (
  root,
  args,
  context,
  info
): Promise<Query['crossChainChefUser']> => {
  // console.debug('_crossChainChefUser')
  return Promise.allSettled<Query['crossChainChefUser']>([
    ...args.chainIds
      .filter((chainId) => chainId === ChainId.ETHEREUM)
      .flatMap((chainId) => [
        context.MasterChefV1.Query.MASTERCHEF_V1_users({
          root,
          args,
          context: {
            ...context,
            chainId: ChainId.ETHEREUM,
            subgraphName: MASTERCHEF_V1_SUBGRAPH_NAME,
            subgraphHost: SUBGRAPH_HOST[ChainId.ETHEREUM],
          },
          info,
        }).then((users: Query['MASTERCHEF_V1_users']) => {
          if (!Array.isArray(users)) {
            console.error(`MasterChefV1 users query failed on ${chainId}`, users)
            return []
          }
          return users.map((user) => ({
            ...user,
            chainId,
            chainName: chainName[chainId],
          }))
        }),
        context.MasterChefV2.Query.MASTERCHEF_V2_users({
          root,
          args,
          context: {
            ...context,
            chainId: ChainId.ETHEREUM,
            subgraphName: MASTERCHEF_V2_SUBGRAPH_NAME,
            subgraphHost: SUBGRAPH_HOST[ChainId.ETHEREUM],
          },
          info,
        }).then((users: Query['MASTERCHEF_V2_users']) => {
          if (!Array.isArray(users)) {
            console.error(`MasterChefV2 users query failed on ${chainId}`, users)
            return []
          }
          return users.map((user) => ({
            ...user,
            chainId,
            chainName: chainName[chainId],
          }))
        }),
      ]),
    ...args.chainIds
      .filter((chainId): chainId is keyof typeof MINICHEF_SUBGRAPH_NAME => chainId in MINICHEF_SUBGRAPH_NAME)
      .map(
        (chainId) =>
          // Weird that we're doing this....
          context.MasterChefV1.Query.MASTERCHEF_V1_users({
            root,
            args,
            context: {
              ...context,
              chainId,
              subgraphName: MINICHEF_SUBGRAPH_NAME[chainId],
              subgraphHost: SUBGRAPH_HOST[chainId],
            },
            info,
          }).then((users: Query['MASTERCHEF_V1_users']) => {
            if (!Array.isArray(users)) {
              console.error(`MiniChefV2 users query failed on ${chainId}`, users)
              return []
            }
            return users.map((user) => ({
              ...user,
              chainId,
              chainName: chainName[chainId],
            }))
          })
        // fetcher({ chainId, subgraphName: MINICHEF_SUBGRAPH_NAME[chainId], subgraphHost: SUBGRAPH_HOST[chainId] })
      ),
  ]).then((promiseSettledResults) => {
    if (!Array.isArray(promiseSettledResults)) {
      console.log('crossChainChefUser query failed...', promiseSettledResults)
      return []
    }
    return promiseSettledResults
      .flat()
      .filter(isPromiseFulfilled)
      .map((promiseFulfilled) => promiseFulfilled.value)
      .flat()
    // .filter((user) => user.pool)
  })
}

export const resolvers: Resolvers = {
  ChefUser: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Query: {
    crossChainChefUser,
  },
}
