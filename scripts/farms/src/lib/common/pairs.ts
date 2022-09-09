import { ChainId } from '@sushiswap/chain'
import { BigNumber } from 'ethers'
import { Farm } from 'src/types'

import { EXCHANGE_SUBGRAPH_NAME, GRAPH_HOST, TRIDENT_SUBGRAPH_NAME } from '../../config'
import { divBigNumberToNumber } from './utils'

interface Pair {
  id: string
  totalSupply: number
  liquidityUSD: number
  type: Farm['poolType']
}

async function getExchangePairs(ids: string[], chainId: ChainId): Promise<Pair[]> {
  const { getBuiltGraphSDK } = await import('../../../.graphclient')
  const subgraphName = EXCHANGE_SUBGRAPH_NAME[chainId]
  if (!subgraphName) return []
  const sdk = getBuiltGraphSDK({ host: GRAPH_HOST[chainId], name: subgraphName })

  let bundle: { nativePrice: number } | null | undefined
  let pairs

  if (chainId === ChainId.POLYGON) {
    ;({ pairs, bundle } = await sdk
      .PolygonPairs({
        first: ids.length,
        where: { id_in: ids.map((id) => id.toLowerCase()) },
      })
      .then(({ pairs, bundle }) => ({
        pairs: pairs.map((pair) => ({ ...pair, liquidity: BigInt(Math.floor(pair.liquidity * 1e18)) })),
        bundle,
      })))
  } else {
    ;({ pairs, bundle } = await sdk.Pairs({
      first: ids.length,
      where: { id_in: ids.map((id) => id.toLowerCase()) },
    }))
  }

  return pairs.map((pair) => {
    const liquidityUSD = pair.liquidityNative * bundle!.nativePrice

    return {
      id: pair.id,
      totalSupply: divBigNumberToNumber(BigNumber.from(pair.liquidity), 18),
      liquidityUSD: liquidityUSD,
      type: 'Legacy',
    }
  })
}

async function getTridentPairs(ids: string[], chainId: ChainId): Promise<Pair[]> {
  const { getBuiltGraphSDK } = await import('../../../.graphclient')
  const subgraphName = TRIDENT_SUBGRAPH_NAME[chainId]
  if (!subgraphName) return []
  const sdk = getBuiltGraphSDK({ host: GRAPH_HOST[chainId], name: subgraphName })

  const { pairs, bundle } = await sdk.Pairs({ where: { id_in: ids.map((id) => id.toLowerCase()) } })

  return pairs.map((pair) => {
    return {
      id: pair.id,
      totalSupply: divBigNumberToNumber(BigNumber.from(pair.liquidity), 18),
      liquidityUSD: pair.liquidityNative * bundle?.nativePrice,
      type: 'Trident',
    }
  })
}

// async function getKashiPairs(ids: string[], chainId: ChainId): Promise<Pair[]> {
//   const { getBuiltGraphSDK } = await import('../../.graphclient')
// }

export async function getPairs(ids: string[], chainId: ChainId) {
  return (await Promise.all([getExchangePairs(ids, chainId), getTridentPairs(ids, chainId)])).flat()
}
