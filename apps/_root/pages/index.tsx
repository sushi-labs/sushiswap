import { InformationCircleIcon } from '@heroicons/react/outline'
import { ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { TradeType } from '@sushiswap/core-sdk'
import { Native, SUSHI, tryParseAmount } from '@sushiswap/currency'
import { formatNumber, formatUSD } from '@sushiswap/format'
import sushiData from '@sushiswap/sushi-data'
import { AppearOnMount, Button, classNames, Currency, Link, Tooltip, Typography } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import { usePrices, useTrade, Web3Input } from '@sushiswap/wagmi'
import { useTokens } from 'lib/state/token-lists'
import React, { useMemo } from 'react'

import { Layout } from '../components'
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

  console.log(bentoTVL)

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
    <Layout>
      <div className="flex flex-col max-w-[560px] lg:max-w-[unset] mx-auto lg:grid lg:grid-cols-[auto_360px] gap-10 lg:gap-[100px]">
        <div className="flex flex-col gap-5 mt-6">
          <Typography variant="hero" weight={700} className="text-center lg:text-left">
            Decentralized Exchange Made For Everybody
          </Typography>
          <Typography variant="lg" className="text-center text-slate-400 lg:text-left">
            Swap, earn, stack yields, lend, borrow, leverage all on one decentralized, community driven platform.
            Welcome home to DeFi.
          </Typography>
          <div className="justify-center hidden lg:flex lg:justify-start">
            <Link.Internal href="/swap" passHref={true}>
              <Button
                as="a"
                color="gradient"
                className="px-12 !font-semibold"
                size="md"
                endIcon={<ArrowRightIcon width={16} height={16} />}
              >
                Enter Sushi
              </Button>
            </Link.Internal>
          </div>
        </div>
        <div className="mx-auto relative w-[360px] h-[368px] min-w-[360px] min-h-[368px] mt-10 lg:mt-0">
          <AppearOnMount>
            <Widget id="swap-widget" maxWidth={400} className="pointer-events-none">
              <Widget.Header title="Swap" />
              <Widget.Content>
                <Web3Input.Currency
                  className="p-3 !text-3xl"
                  value="1"
                  onChange={() => {}}
                  onSelect={() => {}}
                  currency={Native.onChain(ChainId.ETHEREUM)}
                  customTokenMap={customTokensMap}
                  onAddToken={addCustomToken}
                  onRemoveToken={removeCustomToken}
                  chainId={ChainId.ETHEREUM}
                  tokenMap={tokenMap}
                  loading={false}
                />
                <div className="flex items-center justify-center -mt-[12px] -mb-[12px] z-10">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="group bg-slate-700 p-0.5 border-2 border-slate-800 transition-all rounded-full hover:ring-2 hover:ring-slate-500 cursor-pointer"
                  >
                    <div className="transition-all rotate-0 group-hover:rotate-180 group-hover:delay-200">
                      <ChevronDownIcon width={16} height={16} />
                    </div>
                  </button>
                </div>
                <div className="bg-slate-800">
                  <Web3Input.Currency
                    disabled={true}
                    className="p-3 !text-3xl"
                    value={data?.outputAmount.toSignificant(6)}
                    onChange={() => {}}
                    onSelect={() => {}}
                    currency={SUSHI[ChainId.ETHEREUM]}
                    customTokenMap={customTokensMap}
                    onAddToken={addCustomToken}
                    onRemoveToken={removeCustomToken}
                    chainId={ChainId.ETHEREUM}
                    tokenMap={tokenMap}
                    loading={isLoading}
                  />
                  <div className="p-3 !pb-1">
                    <div className="flex justify-between items-center bg-white bg-opacity-[0.04] hover:bg-opacity-[0.08] rounded-2xl px-4 mb-4 py-2.5 gap-2">
                      <div className="text-sm text-slate-300 hover:text-slate-50 cursor-pointer flex items-center h-full gap-1 font-semibold tracking-tight h-[36px] flex items-center truncate">
                        <Tooltip
                          panel={<div className="grid grid-cols-2 gap-1">{stats}</div>}
                          button={<InformationCircleIcon width={16} height={16} />}
                        />
                        1 ETH = {data?.outputAmount.toSignificant(6)} SUSHI{' '}
                        <span className="font-medium text-slate-500">(${usdPrice})</span>
                      </div>
                      <div className="flex items-center justify-end flex-grow cursor-pointer">
                        <ChevronDownIcon
                          width={24}
                          height={24}
                          className={classNames('rotate-0 transition-[transform] duration-300 ease-in-out delay-200')}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 pt-0">
                    <Button size="md" fullWidth>
                      Swap
                    </Button>
                  </div>
                </div>
              </Widget.Content>
            </Widget>
          </AppearOnMount>
          <Link.Internal href="/swap" passHref={true}>
            <a>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900" />
            </a>
          </Link.Internal>
        </div>
        <div className="flex justify-center lg:hidden lg:justify-start">
          <Link.Internal href="/swap" passHref={true}>
            <Button
              as="a"
              color="gradient"
              className="px-12 !font-semibold"
              size="md"
              endIcon={<ArrowRightIcon width={16} height={16} />}
            >
              Enter Sushi
            </Button>
          </Link.Internal>
        </div>
      </div>
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
    </Layout>
  )
}

export default Index
