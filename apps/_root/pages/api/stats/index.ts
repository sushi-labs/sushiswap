import { formatNumber, formatUSD } from '@sushiswap/format'
import stringify from 'fast-json-stable-stringify'
import type { NextApiRequest, NextApiResponse } from 'next'

import getBentoTVL from '../../../functions/graph/fetchers/bentobox'
import { getLegacyExchangeData } from '../../../functions/graph/fetchers/exchange'
import { getTridentExchangeData } from '../../../functions/graph/queries/trident'
import { SUSHI_ADDRESS } from '@sushiswap/currency'
import { ChainId } from '@sushiswap/chain'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600')

  const getSushiPriceUSD = async () => {
    {
      const prices = await fetch('https://token-price.sushi.com/v0/1').then((data) => data.json())
      return prices[SUSHI_ADDRESS[ChainId.ETHEREUM].toLowerCase()]
    }
  }

  const [sushiPrice, bentoTVL, legacyExchangeData, tridentExchangeData] = await Promise.all([
    getSushiPriceUSD(),
    getBentoTVL(),
    getLegacyExchangeData(),
    getTridentExchangeData(),
  ])
  const totalTVL = bentoTVL + legacyExchangeData.tvlUSD
  const totalVolume = legacyExchangeData.volumeUSD + tridentExchangeData.volumeUSD
  const totalPoolCount = legacyExchangeData.pairCount + tridentExchangeData.poolCount

  res.status(200).send(
    stringify({
      stats: {
        price: {
          formatted: formatUSD(sushiPrice),
          number: Number(sushiPrice),
          title: '$SUSHI Price',
          decimalPlaces: 2,
        },
        liquidity: {
          formatted: formatUSD(totalTVL),
          number: totalTVL,
          title: 'Total Liquidity',
          decimalPlaces: 0,
        },
        volume: {
          formatted: formatUSD(totalVolume),
          number: totalVolume,
          title: 'Total Volume',
          decimalPlaces: 0,
        },
        pairs: {
          formatted: formatNumber(totalPoolCount),
          number: totalPoolCount,
          title: 'Total Pairs',
          decimalPlaces: 0,
        },
      },
    })
  )
}
