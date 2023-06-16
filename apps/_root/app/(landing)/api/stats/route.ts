import { NextResponse } from 'next/server'

import { formatNumber, formatUSD } from '@sushiswap/format'
import { SUSHI_ADDRESS } from '@sushiswap/currency'
import { ChainId } from '@sushiswap/chain'

import getBentoTVL from 'functions/graph/fetchers/bentobox'
import { getLegacyExchangeData } from 'functions/graph/fetchers/exchange'
import { getTridentExchangeData } from 'functions/graph/queries/trident'

const getSushiPriceUSD = async () => {
  {
    const prices = await fetch('https://token-price.sushi.com/v1/1').then((data) => data.json())
    return prices[SUSHI_ADDRESS[ChainId.ETHEREUM].toLowerCase()]
  }
}

export const fetchCache = 'auto'

export async function GET() {
  const [sushiPrice, bentoTVL, legacyExchangeData, tridentExchangeData] = await Promise.all([
    getSushiPriceUSD(),
    getBentoTVL(),
    getLegacyExchangeData(),
    getTridentExchangeData(),
  ])
  const totalTVL = bentoTVL + legacyExchangeData.tvlUSD
  const totalVolume = legacyExchangeData.volumeUSD + tridentExchangeData.volumeUSD
  const totalPoolCount = legacyExchangeData.pairCount + tridentExchangeData.poolCount

  return NextResponse.json({
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
}
