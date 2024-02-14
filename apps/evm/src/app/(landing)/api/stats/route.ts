import { getBuiltGraphSDK } from '@sushiswap/graph-client'
import { BENTOBOX_ENABLED_NETWORKS } from '@sushiswap/graph-config'
import { SUSHISWAP_V2_SUPPORTED_CHAIN_IDS } from '@sushiswap/v2-sdk'
import { SUSHISWAP_V3_SUPPORTED_CHAIN_IDS } from '@sushiswap/v3-sdk'
import { roundToNearestMinutes, sub } from 'date-fns'
import { NextResponse } from 'next/server'
import { DISABLED_ANALYTICS_CHAIN_IDS } from 'src/config'
import { getPrices } from 'src/lib/price/v1'
import { getPrice } from 'src/lib/price/v2'
import { ChainId } from 'sushi/chain'
import { SUSHI_ADDRESS } from 'sushi/currency'
import { formatNumber, formatUSD } from 'sushi/format'
import { getAddress } from 'viem'

const getSushiPriceUSD = async () => {
  return getPrice(ChainId.ETHEREUM, SUSHI_ADDRESS[ChainId.ETHEREUM])
}

interface ExchangeData {
  tvlUSD: number
  volumeUSD: number
  pairCount: number
}

const getV2Data = async () => {
  const sdk = getBuiltGraphSDK()
  const { factories } = await sdk.Factories({
    chainIds: SUSHISWAP_V2_SUPPORTED_CHAIN_IDS.filter(
      (c) =>
        !DISABLED_ANALYTICS_CHAIN_IDS.includes(
          c as typeof DISABLED_ANALYTICS_CHAIN_IDS[number],
        ),
    ),
  })

  return {
    v2: factories
      .filter(({ id }) => id !== 'ALL')
      .reduce<ExchangeData>(
        (acc, cur) => {
          return {
            tvlUSD: acc.tvlUSD + Number(cur.liquidityUSD),
            volumeUSD: acc.volumeUSD + Number(cur.volumeUSD),
            pairCount: acc.pairCount + Number(cur.pairCount),
          }
        },
        {
          tvlUSD: 0,
          volumeUSD: 0,
          pairCount: 0,
        },
      ),
    trident: factories
      .filter(({ id }) => id === 'ALL')
      .reduce<ExchangeData>(
        (acc, cur) => {
          return {
            tvlUSD: acc.tvlUSD + Number(cur.liquidityUSD),
            volumeUSD: acc.volumeUSD + Number(cur.volumeUSD),
            pairCount: acc.pairCount + Number(cur.pairCount),
          }
        },
        {
          tvlUSD: 0,
          volumeUSD: 0,
          pairCount: 0,
        },
      ),
  }
}

const getBentoTvl = async () => {
  const sdk = getBuiltGraphSDK()
  const { rebases } = await sdk.RebasesByChainIds({
    first: 1000,
    chainIds: BENTOBOX_ENABLED_NETWORKS,
  })

  const threeDaysAgo = sub(new Date(), { days: 3 })
  const dateThreshold = roundToNearestMinutes(threeDaysAgo, { nearestTo: 10 })
  const prices = await getPrices(dateThreshold)

  return rebases.reduce((acc, cur) => {
    const price =
      prices?.[cur.chainId]?.[cur.id] ||
      prices?.[cur.chainId]?.[getAddress(cur.id)]
    if (!price) return acc

    return (
      acc +
      (Number(cur.elastic) / 10 ** Number(cur.token.decimals)) * Number(price)
    )
  }, 0)
}

const getV3Data = async () => {
  const sdk = getBuiltGraphSDK()
  const { factories } = await sdk.V3Factories({
    chainIds: SUSHISWAP_V3_SUPPORTED_CHAIN_IDS.filter(
      (c) =>
        !DISABLED_ANALYTICS_CHAIN_IDS.includes(
          c as typeof DISABLED_ANALYTICS_CHAIN_IDS[number],
        ),
    ),
  })

  return factories.reduce<ExchangeData>(
    (acc, cur) => {
      return {
        tvlUSD: acc.tvlUSD + Number(cur.totalValueLockedUSD),
        volumeUSD: acc.volumeUSD + Number(cur.totalVolumeUSD),
        pairCount: acc.pairCount + Number(cur.poolCount),
      }
    },
    {
      tvlUSD: 0,
      volumeUSD: 0,
      pairCount: 0,
    },
  )
}

export const revalidate = 3600

export async function GET() {
  const [sushiPrice, bentoTVL, v2Data, v3Data] = await Promise.all([
    getSushiPriceUSD(),
    getBentoTvl(),
    getV2Data(),
    getV3Data(),
  ])

  let totalTVL =
    Number(bentoTVL) + Number(v2Data.v2.tvlUSD) + Number(v3Data.tvlUSD)
  let totalVolume =
    Number(v2Data.v2.volumeUSD) +
    Number(v2Data.trident.volumeUSD) +
    Number(v3Data.volumeUSD)
  const totalPoolCount =
    Number(v2Data.v2.pairCount) +
    Number(v2Data.trident.pairCount) +
    Number(v3Data.pairCount)

  totalTVL = totalTVL > 10_000_000_000 ? 0 : totalTVL
  totalVolume = totalVolume > 5_000_000_000_000 ? 0 : totalVolume

  return NextResponse.json({
    stats: {
      price: {
        formatted: !sushiPrice ? '-' : formatUSD(sushiPrice),
        number: Number(sushiPrice),
        title: '$SUSHI Price',
        decimalPlaces: 2,
      },
      liquidity: {
        formatted: !totalTVL ? '-' : formatUSD(totalTVL),
        number: totalTVL,
        title: 'Total Liquidity',
        decimalPlaces: 0,
      },
      volume: {
        formatted: !totalVolume ? '-' : formatUSD(totalVolume),
        number: totalVolume,
        title: 'Total Volume',
        decimalPlaces: 0,
      },
      pairs: {
        formatted: !totalPoolCount ? '-' : formatNumber(totalPoolCount),
        number: totalPoolCount,
        title: 'Total Pairs',
        decimalPlaces: 0,
      },
    },
  })
}
