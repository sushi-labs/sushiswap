import { ChainId } from '@sushiswap/chain'
import { TradeType } from '@sushiswap/core-sdk'
import { Native, SUSHI, tryParseAmount } from '@sushiswap/currency'
import { formatNumber, formatUSD } from '@sushiswap/format'
import sushiData from '@sushiswap/sushi-data'
import { Container, Currency, Typography } from '@sushiswap/ui'
import { usePrices, useTrade } from '@sushiswap/wagmi'
import { useTokens } from 'lib/state/token-lists'
import React, { useMemo } from 'react'

import { AnimatedCards } from '../components/AnimatedCards'
import { AnimatedTitle } from '../components/AnimatedTitle/AnimatedTitle'
import { BuildWealth } from '../components/BuildWealth/BuildWealth'
import { PRODUCT_CARDS } from '../components/data'
import { Hero } from '../components/Hero/Hero'
import { NeedHelp } from '../components/NeedHelp/NeedHelp'
import { Partners } from '../components/Partners/Partners'
import { Story } from '../components/Story/Story'
import getBentoTVL from '../functions/graph/fetchers/bentobox'
import { getLegacyExchangeData } from '../functions/graph/fetchers/exchange'
import { getTridentExchangeData } from '../functions/graph/queries/trident'
import { useCustomTokens } from '../lib/state/storage'

export async function getStaticProps() {
  const [sushiPrice, bentoTVL, legacyExchangeData, tridentExchangeData] = await Promise.all([
    sushiData.sushi.priceUSD(),
    getBentoTVL(),
    getLegacyExchangeData(),
    getTridentExchangeData(),
  ])
  const totalTVL = bentoTVL + legacyExchangeData.tvlUSD
  const totalVolume = legacyExchangeData.volumeUSD + tridentExchangeData.volumeUSD
  const totalPoolCount = legacyExchangeData.pairCount + tridentExchangeData.poolCount
  return {
    props: {
      stats: [
        {
          formatted: formatUSD(sushiPrice),
          number: Number(sushiPrice),
          title: '$SUSHI Price',
          decimalPlaces: 2,
        },
        {
          formatted: formatUSD(totalTVL),
          number: totalTVL,
          title: 'Total Liquidity',
          decimalPlaces: 0,
        },
        {
          formatted: formatUSD(totalVolume),
          number: totalVolume,
          title: 'Total Volume',
          decimalPlaces: 0,
        },
        {
          formatted: formatNumber(totalPoolCount),
          number: totalPoolCount,
          title: 'Total Pairs',
          decimalPlaces: 0,
        },
      ],
    },
    revalidate: 60, // In seconds
  }
}

const Index = ({ stats }) => {
  const [price, liquidity, volume, pairs] = stats
  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(ChainId.ETHEREUM)
  const tokenMap = useTokens(ChainId.ETHEREUM)
  const { data: prices } = usePrices({ chainId: ChainId.ETHEREUM })

  const amount = useMemo(() => tryParseAmount('1', Native.onChain(ChainId.ETHEREUM)), [])
  const { data, isLoading } = useTrade({
    chainId: ChainId.ETHEREUM,
    tradeType: TradeType.EXACT_INPUT,
    amountSpecified: amount,
    mainCurrency: Native.onChain(ChainId.ETHEREUM),
    otherCurrency: SUSHI[ChainId.ETHEREUM],
    tridentEnabled: false,
    ammEnabled: true,
  })

  const usdPrice = data?.executionPrice
    ? prices?.[data.executionPrice.baseCurrency.wrapped.address]?.toFixed(2)
    : undefined

  return (
    <article className="my-20">
      <Hero />
      <section>
        <Container maxWidth="5xl" className="mx-auto">
          <div className="grid grid-cols-2 md:flex md:justify-between my-[120px] gap-10">
            <div className="flex items-center gap-3 px-6 lg:px-0">
              <div className="min-w-[42px] min-h-[42px]">
                <Currency.Icon currency={SUSHI[ChainId.ETHEREUM]} width={42} height={42} />
              </div>
              <div className="flex flex-col justify-center gap-1">
                <Typography variant="h2" weight={600}>
                  {price.formatted}
                </Typography>
                <Typography variant="sm" weight={400} className="text-slate-400 -mt-0.5">
                  SUSHI Price
                </Typography>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 lg:justify-center lg:px-0">
              <div className="flex flex-col justify-center gap-1">
                <Typography variant="h2" weight={600}>
                  {liquidity.formatted}
                </Typography>
                <Typography variant="sm" weight={400} className="text-slate-400 -mt-0.5">
                  Total Liquidity
                </Typography>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 lg:justify-center lg:px-0">
              <div className="flex flex-col justify-center gap-1">
                <Typography variant="h2" weight={600}>
                  {volume.formatted}
                </Typography>
                <Typography variant="sm" weight={400} className="text-slate-400 -mt-0.5">
                  Total Volume
                </Typography>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 lg:px-0">
              <div className="flex flex-col justify-center gap-1">
                <Typography variant="h2" weight={600}>
                  {pairs.formatted}
                </Typography>
                <Typography variant="sm" weight={400} className="text-slate-400 -mt-0.5">
                  Total Pairs
                </Typography>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Partners />
      <Story />

      <div className="flex flex-col gap-2 border-t border-slate-200/5">
        <BuildWealth />
        <section className="py-40">
          <Container maxWidth="5xl" className="mx-auto">
            <div className="flex flex-col gap-20">
              <AnimatedTitle className="text-left">
                Build <span className="text-pink">the future</span> with Sushi.{' '}
                <span className="text-slate-400">{`We invite all developers to explore Sushi's frameworks.`}</span>
              </AnimatedTitle>
              <AnimatedCards data={PRODUCT_CARDS} />
            </div>
          </Container>
        </section>

        <NeedHelp />
      </div>
    </article>
  )
}

export default Index
