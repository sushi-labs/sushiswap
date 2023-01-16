// @ts-nocheck

import { chainName, chainShortNameToChainId } from '@sushiswap/chain'
import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'
import { isPromiseFulfilled } from '@sushiswap/validate'

import { getBuiltGraphSDK, Pair, QueryResolvers } from '../../.graphclient'
import { SushiSwapTypes } from '../../.graphclient/sources/SushiSwap/types'
import { TridentTypes } from '../../.graphclient/sources/Trident/types'
import { getFarms } from '../../lib/farms'
import { transformPair } from '../../transformers'

const sdk = getBuiltGraphSDK()

export const pairById: QueryResolvers['pairById'] = async (root, args, context, info): Promise<Pair | null> => {
  const now = Date.now()

  // const [chainId, address] = args.id.split(':') as [number, string]

  const [chainShortName, address] = args.id.split(':') as [string, string]

  const chainId = chainShortNameToChainId[chainShortName]

  const [
    {
      oneDayBlocks: [oneDayBlock],
    },
    {
      twoDayBlocks: [twoDayBlock],
    },
    {
      oneWeekBlocks: [oneWeekBlock],
    },
  ] = await Promise.all([
    sdk.OneDayBlocks({ chainIds: [chainId] }),
    sdk.TwoDayBlocks({ chainIds: [chainId] }),
    sdk.OneWeekBlocks({ chainIds: [chainId] }),
  ])

  const fetchSushiSwapPair = async (block?: { number: number }) =>
    context.SushiSwap.Query.pair({
      root,
      args: { ...args, id: address, block },
      context: {
        ...context,
        now,
        chainId,
        chainName: chainName[chainId],
        chainShortName: chainShortName[chainId],
        subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId as typeof SUSHISWAP_ENABLED_NETWORKS[number]],
        subgraphHost: SUBGRAPH_HOST[chainId as typeof SUSHISWAP_ENABLED_NETWORKS[number]],
      },
      info,
    }).then((pair: SushiSwapTypes.Pair | null) => {
      if (!pair) return pair
      return { ...pair, chainId, address }
    })

  const fetchTridentPair = async (block?: { number: number }) =>
    context.Trident.Query.pair({
      root,
      args: { ...args, id: address, block },
      context: {
        ...context,
        now,
        chainId,
        chainName: chainName[chainId],
        chainShortName: chainShortName[chainId],
        subgraphName: TRIDENT_SUBGRAPH_NAME[chainId as typeof TRIDENT_ENABLED_NETWORKS[number]],
        subgraphHost: SUBGRAPH_HOST[chainId as typeof TRIDENT_ENABLED_NETWORKS[number]],
      },
      info,
    }).then((pair: TridentTypes.Pair | null) => {
      if (!pair) return pair
      return { ...pair, chainId, address }
    })

  const fetcher = async (block?: { number: number }) => {
    if (SUSHISWAP_ENABLED_NETWORKS.includes(chainId) && !TRIDENT_ENABLED_NETWORKS.includes(chainId)) {
      return fetchSushiSwapPair(block)
    } else if (!SUSHISWAP_ENABLED_NETWORKS.includes(chainId) && TRIDENT_ENABLED_NETWORKS.includes(chainId)) {
      return fetchTridentPair(block)
    } else if (SUSHISWAP_ENABLED_NETWORKS.includes(chainId) && TRIDENT_ENABLED_NETWORKS.includes(chainId)) {
      return Promise.allSettled<Pair[]>([fetchSushiSwapPair(block), fetchTridentPair(block)]).then((results) => {
        return results
          .filter(isPromiseFulfilled)
          .map((promiseFulfilled) => promiseFulfilled.value)
          .filter(Boolean)
          .shift()
      })
    }
  }

  const [pair, pair1d, pair2d, pair1w] = await Promise.all([
    fetcher(),
    fetcher(oneDayBlock),
    fetcher(twoDayBlock),
    fetcher(oneWeekBlock),
  ])

  if (!pair) return null

  // TODO: should be able to get a single farm for this case...
  // const farms = await context.FarmsV0.Query.farmsv0(root, args, context, info)
  const farms = await getFarms()

  return transformPair({
    pair,
    pair1d,
    pair2d,
    pair1w,
    farm: farms?.[chainId]?.farms?.[address.toLowerCase()],
  })
}
