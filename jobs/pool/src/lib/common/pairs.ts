import {
  SUBGRAPH_HOST,
  SUSHISWAP_SUBGRAPH_NAME,
  SushiSwapChainId,
  TRIDENT_SUBGRAPH_NAME,
  TridentChainId,
} from '@sushiswap/graph-config'
import { isSushiSwapChain, isTridentChain } from '@sushiswap/validate'

import type { Farm } from '../types.js'
import { divBigIntToNumber } from './utils.js'

interface Pair {
  id: string
  totalSupply: number
  liquidityUSD: number
  type: Farm['poolType']
}

async function getExchangePairs(ids: string[], chainId: SushiSwapChainId): Promise<Pair[]> {
  const { getBuiltGraphSDK } = await import('../../../.graphclient/index.js')
  const subgraphName = SUSHISWAP_SUBGRAPH_NAME[chainId]
  if (!subgraphName) return []
  const sdk = getBuiltGraphSDK({
    host: SUBGRAPH_HOST[chainId],
    name: subgraphName,
  })

  const { pairs, bundle } = await sdk.Pairs({
    first: ids.length,
    where: { id_in: ids.map((id) => id.toLowerCase()) },
  })

  return pairs.map((pair) => {
    const liquidityUSD = pair.liquidityNative * bundle?.nativePrice

    return {
      id: pair.id,
      totalSupply: divBigIntToNumber(BigInt(pair.liquidity), 18),
      liquidityUSD: liquidityUSD,
      type: 'Legacy',
    }
  })
}

async function getTridentPairs(
  ids: string[],
  chainId: keyof typeof SUBGRAPH_HOST & keyof typeof TRIDENT_SUBGRAPH_NAME
): Promise<Pair[]> {
  const { getBuiltGraphSDK } = await import('../../../.graphclient/index.js')
  const subgraphName = TRIDENT_SUBGRAPH_NAME[chainId]
  if (!subgraphName) return []
  const sdk = getBuiltGraphSDK({
    host: SUBGRAPH_HOST[chainId],
    name: subgraphName,
  })

  const { pairs, bundle } = await sdk.Pairs({
    where: { id_in: ids.map((id) => id.toLowerCase()) },
  })

  return pairs.map((pair) => {
    return {
      id: pair.id,
      totalSupply: divBigIntToNumber(BigInt(pair.liquidity), 18),
      liquidityUSD: pair.liquidityNative * bundle?.nativePrice,
      type: 'Trident',
    }
  })
}

// async function getKashiPairs(ids: string[], chainId: ChainId): Promise<Pair[]> {
//   const { getBuiltGraphSDK } = await import('../../.graphclient')
// }

export async function getPairs(ids: string[], chainId: SushiSwapChainId | TridentChainId) {
  return (
    await Promise.all([
      isSushiSwapChain(chainId) ? getExchangePairs(ids, chainId) : [],
      isTridentChain(chainId) ? getTridentPairs(ids, chainId) : [],
    ])
  ).flat()
}
