// @ts-nocheck

import { chainName, chainShortNameToChainId } from '@sushiswap/chain'
import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  SUSHISWAP_V3_ENABLED_NETWORKS,
  SUSHISWAP_V3_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'
import { isPromiseFulfilled } from '@sushiswap/validate'

import { getBuiltGraphSDK, Pair, QueryResolvers } from '../../.graphclient/index.js'
import { ConcentratedTypes } from '../../.graphclient/sources/Concentrated/types.js'
import { SushiSwapTypes } from '../../.graphclient/sources/SushiSwap/types.js'
import { TridentTypes } from '../../.graphclient/sources/Trident/types.js'
import { transformPair } from '../../transformers/index.js'

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
      args: { ...args, id: address.toLowerCase(), block },
      context: {
        ...context,
        now,
        chainId,
        chainName: chainName[chainId],
        chainShortName: chainShortName[chainId],
        subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId as (typeof SUSHISWAP_ENABLED_NETWORKS)[number]],
        subgraphHost: SUBGRAPH_HOST[chainId as (typeof SUSHISWAP_ENABLED_NETWORKS)[number]],
      },
      info,
    }).then((pair: SushiSwapTypes.Pair | null) => {
      if (!pair) return pair
      return { ...pair, chainId, address }
    })

  const fetchTridentPair = async (block?: { number: number }) =>
    context.Trident.Query.pair({
      root,
      args: { ...args, id: address.toLowerCase(), block },
      context: {
        ...context,
        now,
        chainId,
        chainName: chainName[chainId],
        chainShortName: chainShortName[chainId],
        subgraphName: TRIDENT_SUBGRAPH_NAME[chainId as (typeof TRIDENT_ENABLED_NETWORKS)[number]],
        subgraphHost: SUBGRAPH_HOST[chainId as (typeof TRIDENT_ENABLED_NETWORKS)[number]],
      },
      info,
    }).then((pair: TridentTypes.Pair | null) => {
      if (!pair) return pair
      return { ...pair, chainId, address }
    })

  const fetchSushiSwapV3Pair = async (block?: { number: number }) =>
    (context.Concentrated.Query as ConcentratedTypes.Query)
      .CONCENTRATED_pool({
        root,
        args: { ...args, id: address.toLowerCase(), block },
        context: {
          ...context,
          now,
          chainId,
          chainName: chainName[chainId],
          chainShortName: chainShortName[chainId],
          subgraphName: SUSHISWAP_V3_SUBGRAPH_NAME[chainId as (typeof SUSHISWAP_ENABLED_NETWORKS)[number]],
          subgraphHost: SUBGRAPH_HOST[chainId as (typeof SUSHISWAP_ENABLED_NETWORKS)[number]],
        },
        info,
      })
      .then((pair: ConcentratedTypes.CONCENTRATED_Pool | null) => {
        if (!pair) return pair
        return { ...pair, chainId, address }
      })

  const fetcher = async (block?: { number: number }) => {
    const fetches: ReturnType<typeof fetchSushiSwapPair | typeof fetchTridentPair>[] = []

    if (SUSHISWAP_ENABLED_NETWORKS.includes(chainId)) {
      fetches.push(fetchSushiSwapPair(block))
    }

    if (TRIDENT_ENABLED_NETWORKS.includes(chainId)) {
      fetches.push(fetchTridentPair(block))
    }

    if (SUSHISWAP_V3_ENABLED_NETWORKS.includes(chainId)) {
      fetches.push(fetchSushiSwapV3Pair(block))
    }

    return Promise.allSettled<Pair[]>(fetches).then((results) => {
      return results
        .filter(isPromiseFulfilled)
        .map((promiseFulfilled) => promiseFulfilled.value)
        .filter(Boolean)
        .shift()
    })
  }

  const [pair, pair1d, pair2d, pair1w] = await Promise.all([
    fetcher(),
    fetcher(oneDayBlock),
    fetcher(twoDayBlock),
    fetcher(oneWeekBlock),
  ])

  if (!pair) return null

  return transformPair({
    pair,
    pair1d,
    pair2d,
    pair1w,
  })
}
