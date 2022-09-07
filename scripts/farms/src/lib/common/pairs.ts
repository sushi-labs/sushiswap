import { ChainId } from '@sushiswap/chain'
import { daysInWeek, daysInYear } from 'date-fns'
import { BigNumber } from 'ethers'
import { Farm } from 'src/types'

import { EXCHANGE_SUBGRAPH_NAME, GRAPH_HOST, TRIDENT_SUBGRAPH_NAME } from '../../config'
import { getBlockDaysAgo } from './blocks'
import { aprToApy, divBigNumberToNumber } from './utils'

interface Pair {
  id: string
  feeApy: number
  totalSupply: number
  liquidityUSD: number
  type: Farm['poolType']
}

const WEEKS_IN_YEAR = daysInYear / daysInWeek
const EXCHANGE_LP_FEE = 0.0025

async function getExchangePairs(ids: string[], chainId: ChainId): Promise<Pair[]> {
  const { getBuiltGraphSDK } = await import('../../../.graphclient')
  const subgraphName = EXCHANGE_SUBGRAPH_NAME[chainId]
  if (!subgraphName) return []
  const sdk = getBuiltGraphSDK({ host: GRAPH_HOST[chainId], name: subgraphName })

  let bundle: { nativePrice: number } | null | undefined
  let pairs

  if (chainId === ChainId.POLYGON) {
    const block7d = await getBlockDaysAgo(7, chainId)

    const [{ pairs: pairsL, bundle: bundleL }, { pairs: pairs7d }] = await Promise.all([
      sdk.PolygonPairs({ first: ids.length, where: { id_in: ids.map((id) => id.toLowerCase()) } }),
      sdk.PolygonPairs({
        first: ids.length,
        where: { id_in: ids.map((id) => id.toLowerCase()) },
        block: { number: block7d?.number },
      }),
    ])

    bundle = bundleL
    pairs = pairsL.map((pair) => {
      const pair7d = pairs7d.find((pair7d) => pair7d.id === pair.id)
      const feeApr = pair7d
        ? ((pair.volumeUSD - pair7d.volumeUSD) * EXCHANGE_LP_FEE * WEEKS_IN_YEAR) / pair.liquidityUSD
        : 0

      return { ...pair, apr: feeApr }
    })
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
      feeApy: aprToApy(pair.apr * 100, 3650) / 100,
      totalSupply: pair.liquidity,
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
      feeApy: aprToApy(pair.apr * 100, 3650) / 100,
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
