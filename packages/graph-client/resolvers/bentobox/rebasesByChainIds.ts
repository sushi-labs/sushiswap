// @ts-nocheck

import { BENTOBOX_SUBGRAPH_NAME, SUBGRAPH_HOST } from '@sushiswap/graph-config'
import { isPromiseFulfilled } from 'sushi/validate'

import { Query } from '../../.graphclient/index.js'
import { BentoBoxTypes } from '../../.graphclient/sources/BentoBox/types.js'

export const rebasesByChainIds = async (
  root,
  args,
  context,
  info,
): Promise<Query['rebasesByChainIds']> => {
  return Promise.allSettled<Query['rebasesByChainIds'][]>(
    args.chainIds
      .filter(
        (chainId): chainId is keyof typeof BENTOBOX_SUBGRAPH_NAME =>
          chainId in BENTOBOX_SUBGRAPH_NAME,
      )
      .map((chainId) => {
        return context.BentoBox.Query.rebases({
          root,
          args,
          context: {
            ...context,
            chainId,
            subgraphName: BENTOBOX_SUBGRAPH_NAME[chainId],
            subgraphHost: SUBGRAPH_HOST[chainId],
          },
          info,
        }).then((rebases: BentoBoxTypes.Rebase[]) => {
          if (!Array.isArray(rebases)) {
            console.error('rebases query failed...', rebases)
            return []
          }
          return rebases.map((rebase) => ({ ...rebase, chainId }))
        })
      }),
  ).then((promiseSettledResults) =>
    promiseSettledResults
      .flat()
      .filter(isPromiseFulfilled)
      .flatMap((promiseFulfilled) => promiseFulfilled.value),
  )
}
