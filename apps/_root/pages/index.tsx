import { ArrowRightIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { SUSHI } from '@sushiswap/currency'
import { formatNumber, formatUSD } from '@sushiswap/format'
import sushiData from '@sushiswap/sushi-data'
import { Button, Currency, Typography } from '@sushiswap/ui'
import Image from 'next/image'
import React from 'react'

import { Layout } from '../components'
import getBentoTVL from '../functions/graph/fetchers/bentobox'
import { getLegacyExchangeData } from '../functions/graph/fetchers/exchange'
import { getTridentExchangeData } from '../functions/graph/queries/trident'

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

  return (
    <Layout>
      <div className="flex max-w-[560px] lg:max-w-[unset] mx-auto lg:grid lg:grid-cols-[574px_auto] lg:gap-20">
        <div className="flex flex-col gap-5 mt-10">
          <Typography variant="hero" weight={700} className="text-center lg:text-left">
            Decentralized Exchange Made For Everybody
          </Typography>
          <Typography variant="lg" className="text-slate-400 text-center lg:text-left">
            Swap, earn, stack yields, lend, borrow, leverage all on one decentralized, community driven platform.
            Welcome home to DeFi.
          </Typography>
          <div className="mx-auto lg:hidden relative w-[320px] lg:w-[420px] lg:p-10 mt-10 lg:mt-0">
            <Image src="https://sushi.com/swap-example.png" layout="responsive" width="396px" height="378px" />
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-slate-900" />
          </div>
          <div className="flex justify-center lg:justify-start">
            <Button className="px-12 mt-6 !font-semibold" size="md" endIcon={<ArrowRightIcon width={16} height={16} />}>
              Enter Sushi
            </Button>
          </div>
        </div>
        <div className="relative h-full">
          <Image src="https://sushi.com/swap-example.png" layout="responsive" width="396px" height="378px" />
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-slate-900" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:flex md:justify-between my-[120px] gap-10">
        <div className="flex items-center gap-3 px-6 lg:px-0">
          <div className="min-w-[42px] min-h-[42px]">
            <Currency.Icon currency={SUSHI[ChainId.ETHEREUM]} width={42} height={42} />
          </div>
          <div className="flex flex-col gap-1 justify-center">
            <Typography variant="h2" weight={600}>
              {price.formatted}
            </Typography>
            <Typography variant="sm" weight={400} className="text-slate-400 -mt-0.5">
              SUSHI Price
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-end lg:justify-center px-6 lg:px-0">
          <div className="flex flex-col gap-1 justify-center">
            <Typography variant="h2" weight={600}>
              {liquidity.formatted}
            </Typography>
            <Typography variant="sm" weight={400} className="text-slate-400 -mt-0.5">
              Total Liquidity
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-3 lg:justify-center px-6 lg:px-0">
          <div className="flex flex-col gap-1 justify-center">
            <Typography variant="h2" weight={600}>
              {volume.formatted}
            </Typography>
            <Typography variant="sm" weight={400} className="text-slate-400 -mt-0.5">
              Total Volume
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-end px-6 lg:px-0">
          <div className="flex flex-col gap-1 justify-center">
            <Typography variant="h2" weight={600}>
              {pairs.formatted}
            </Typography>
            <Typography variant="sm" weight={400} className="text-slate-400 -mt-0.5">
              Total Pairs
            </Typography>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Index
