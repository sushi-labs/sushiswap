import { getBuiltGraphSDK } from '@sushiswap/graph-client'
import { BENTOBOX_ENABLED_NETWORKS } from '@sushiswap/graph-config'
import { NextResponse } from 'next/server'
import { SUSHISWAP_V3_SUPPORTED_CHAIN_IDS } from 'sushi'
import { ChainId } from 'sushi/chain'
import { SUSHISWAP_V2_SUPPORTED_CHAIN_IDS } from 'sushi/config'
import { SUSHI_ADDRESS } from 'sushi/currency'
import { formatNumber, formatUSD } from 'sushi/format'
import { getAddress } from 'viem'

const getSushiPriceUSD = async () => {
  const url = `https://token-price.sushi.com/v2/1/${
    SUSHI_ADDRESS[ChainId.ETHEREUM]
  }`

  const res = await fetch(url)
  const json = await res.json()
  return json
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
      (value) => value !== ChainId.KAVA,
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

  const prices = await fetch('https://token-price.sushi.com/v1').then((data) =>
    data.json(),
  )

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
    chainIds: SUSHISWAP_V3_SUPPORTED_CHAIN_IDS,
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

export const fetchCache = 'auto'

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
