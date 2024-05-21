import {
  SUSHISWAP_V2_SUBGRAPH_URL,
  SushiSwapChainId,
  TRIDENT_SUBGRAPH_URL,
  TridentChainId,
} from '@sushiswap/graph-config'
import { isSushiSwapChain, isTridentChain } from '@sushiswap/graph-config'

import type { Farm } from '../types.js'
import { divBigIntToNumber } from './utils.js'

interface Pair {
  id: string
  totalSupply: number
  liquidityUSD: number
  type: Farm['poolType']
}

async function getExchangePairs(
  ids: string[],
  chainId: SushiSwapChainId,
): Promise<Pair[]> {
  const { getBuiltGraphSDK } = await import('../../../.graphclient/index.js')
  const url = SUSHISWAP_V2_SUBGRAPH_URL[chainId]
  if (!url) return []
  const sdk = getBuiltGraphSDK({
    url,
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
  chainId: keyof typeof TRIDENT_SUBGRAPH_URL,
): Promise<Pair[]> {
  const { getBuiltGraphSDK } = await import('../../../.graphclient/index.js')
  const url = TRIDENT_SUBGRAPH_URL[chainId]
  if (!url) return []
  const sdk = getBuiltGraphSDK({
    url,
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

export async function getPairs(
  ids: string[],
  chainId: SushiSwapChainId | TridentChainId,
) {
  return (
    await Promise.all([
      isSushiSwapChain(chainId) ? getExchangePairs(ids, chainId) : [],
      isTridentChain(chainId) ? getTridentPairs(ids, chainId) : [],
    ])
  ).flat()
}
