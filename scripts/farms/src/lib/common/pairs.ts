import { ChainId } from '@sushiswap/chain'
import { EXCHANGE_SUBGRAPH_NAME, SUBGRAPH_HOST, TRIDENT_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { daysInWeek, daysInYear } from 'date-fns'
import { BigNumber } from 'ethers'
import { Farm } from 'src/types'

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
  const sdk = getBuiltGraphSDK({ host: SUBGRAPH_HOST[chainId], name: subgraphName })

  const block7d = await getBlockDaysAgo(7, chainId)

  const [{ pairs }, { pairs: pairs7d }, { bundle }] = await Promise.all([
    sdk.ExchangePairs({ first: ids.length, where: { id_in: ids.map((id) => id.toLowerCase()) } }),
    sdk.ExchangePairs({
      first: ids.length,
      where: { id_in: ids.map((id) => id.toLowerCase()) },
      block: { number: block7d?.number },
    }),
    sdk.ExchangeBundle(),
  ])

  return pairs.map((pair) => {
    const pair7d = pairs7d.find((pair7d) => pair7d.id === pair.id)

    const feeApr = pair7d
      ? ((pair.volumeUSD - pair7d.volumeUSD) * EXCHANGE_LP_FEE * WEEKS_IN_YEAR) / pair.reserveUSD
      : 0

    return {
      id: pair.id,
      feeApy: aprToApy(feeApr * 100, 3650) / 100,
      totalSupply: pair.totalSupply,
      liquidityUSD: pair.trackedReserveETH * bundle?.ethPrice,
      type: 'Legacy',
    }
  })
}

async function getTridentPairs(ids: string[], chainId: ChainId): Promise<Pair[]> {
  const { getBuiltGraphSDK } = await import('../../../.graphclient')
  const subgraphName = TRIDENT_SUBGRAPH_NAME[chainId]
  if (!subgraphName) return []
  const sdk = getBuiltGraphSDK({ host: SUBGRAPH_HOST[chainId], name: subgraphName })

  const block7d = await getBlockDaysAgo(7, chainId)

  const [{ pairs }, { pairs: pairs7d }, { bundle }] = await Promise.all([
    sdk.TridentPairs({ where: { id_in: ids.map((id) => id.toLowerCase()) } }),
    sdk.TridentPairs({
      where: { id_in: ids.map((id) => id.toLowerCase()) },
      block: { number: block7d?.number },
    }),
    sdk.TridentBundle(),
  ])

  return pairs.map((pair) => {
    const pair7d = pairs7d.find((pair7d) => pair7d.id === pair.id)

    const feeApr = pair7d ? ((pair.feesNative - pair7d.feesNative) * WEEKS_IN_YEAR) / pair.liquidityNative : 0

    return {
      id: pair.id,
      feeApy: aprToApy(feeApr * 100, 3650) / 100,
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
