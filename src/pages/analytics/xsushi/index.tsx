import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, SUSHI_ADDRESS } from '@sushiswap/core-sdk'
import TimespanGraph from 'app/components/TimespanGraph'
import Typography from 'app/components/Typography'
import { XSUSHI } from 'app/config/tokens'
import InfoCard from 'app/features/analytics/bar/InfoCard'
import { classNames, formatNumber, formatPercent } from 'app/functions'
import { aprToApy } from 'app/functions/convert/apyApr'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import {
  useDayData,
  useNativePrice,
  useOneDayBlock,
  useOneMonthBlock,
  useOneYearBlock,
  useSixMonthBlock,
  useThreeMonthBlock,
  useTokenDayData,
  useTokens,
} from 'app/services/graph'
import { useBar, useBarHistory } from 'app/services/graph/hooks/bar'
import { NextSeo } from 'next-seo'
import React, { useMemo } from 'react'
const chartTimespans = [
  {
    text: '1W',
    length: 604800,
  },
  {
    text: '1M',
    length: 2629746,
  },
  {
    text: '1Y',
    length: 31556952,
  },
  {
    text: 'ALL',
    length: Infinity,
  },
]

export default function XSushi() {
  const { i18n } = useLingui()

  const { data: block1d } = useOneDayBlock({ chainId: ChainId.ETHEREUM })

  const { data: block1m } = useOneMonthBlock({ chainId: ChainId.ETHEREUM })

  const { data: block3m } = useThreeMonthBlock({ chainId: ChainId.ETHEREUM })

  const { data: block6m } = useSixMonthBlock({ chainId: ChainId.ETHEREUM })

  const { data: block1y } = useOneYearBlock({ chainId: ChainId.ETHEREUM })

  const dayData = useDayData({ chainId: ChainId.ETHEREUM })

  const { data: ethPrice } = useNativePrice({ chainId: ChainId.ETHEREUM })

  const { data: ethPrice1d } = useNativePrice({
    chainId: ChainId.ETHEREUM,
    variables: { block: block1d },
    shouldFetch: !!block1d,
  })

  const xSushi = useTokens({
    chainId: ChainId.ETHEREUM,
    variables: { where: { id: XSUSHI.address.toLowerCase() } },
  })?.[0]

  const xSushi1d = useTokens({
    chainId: ChainId.ETHEREUM,
    variables: { block: block1d, where: { id: XSUSHI.address.toLowerCase() } },
  })?.[0]

  const sushiDayData = useTokenDayData({
    chainId: ChainId.ETHEREUM,
    variables: { where: { token: SUSHI_ADDRESS[ChainId.ETHEREUM].toLowerCase() } },
  })

  const { data: bar } = useBar()

  const { data: bar1d } = useBar({ variables: { block: block1d }, shouldFetch: !!block1d })

  const { data: bar1m } = useBar({
    variables: {
      block: block1m,
    },
    shouldFetch: !!block1m,
  })

  const { data: bar3m } = useBar({
    variables: {
      block: block3m,
    },
    shouldFetch: !!block3m,
  })

  const { data: bar6m } = useBar({
    variables: {
      block: block6m,
    },
    shouldFetch: !!block6m,
  })

  const { data: bar1y } = useBar({
    variables: {
      block: block1y,
    },
    shouldFetch: !!block1y,
  })

  const apy1m = (bar?.ratio / bar1m?.ratio - 1) * 12 * 100

  const apy3m = (bar?.ratio / bar3m?.ratio - 1) * 4 * 100

  const apy6m = (bar?.ratio / bar6m?.ratio - 1) * 2 * 100

  const apy1y = (bar?.ratio / bar1y?.ratio - 1) * 100

  const { data: barHistory } = useBarHistory()

  const [xSushiPrice, xSushiMarketcap] = [
    xSushi?.derivedETH * ethPrice,
    xSushi?.derivedETH * ethPrice * bar?.totalSupply,
  ]

  const [xSushiPrice1d, xSushiMarketcap1d] = [
    xSushi1d?.derivedETH * ethPrice1d,
    xSushi1d?.derivedETH * ethPrice1d * bar1d?.totalSupply,
  ]

  // const APY1d = aprToApy(
  //   (((exchange?.volumeUSD - exchange1d?.volumeUSD) * 0.0005 * 365.25) / (bar?.totalSupply * xSushiPrice)) * 100 ?? 0
  // )
  // // @ts-ignore TYPE NEEDS FIXING
  // const APY1w = aprToApy(data.slice(-7).reduce((acc, day) => (acc += day.APY), 0) / 7)

  const data = useMemo(
    () =>
      barHistory && dayData && sushiDayData && bar
        ? // @ts-ignore TYPE NEEDS FIXING
          barHistory.map((barDay) => {
            // @ts-ignore TYPE NEEDS FIXING
            const exchangeDay = dayData.find((day) => day.date === barDay.date)
            //@ts-ignore TYPE NEEDS FIXING
            const sushiDay = sushiDayData.find((day) => day.date === barDay.date)

            const totalSushiStakedUSD = barDay.xSushiSupply * barDay.ratio * sushiDay.priceUSD

            const APR =
              totalSushiStakedUSD !== 0 ? ((exchangeDay.volumeUSD * 0.0005 * 365) / totalSushiStakedUSD) * 100 : 0

            return {
              APR: APR,
              APY: aprToApy(APR, 365),
              xSushiSupply: barDay.xSushiSupply,
              date: barDay.date,
              feesReceived: exchangeDay.volumeUSD * 0.0005,
              sushiStaked: barDay.sushiStaked,
              sushiHarvested: barDay.sushiHarvested,
            }
          })
        : [],
    [barHistory, dayData, sushiDayData, bar]
  )

  const graphs = useMemo(
    () => [
      // {
      //   title: 'xSushi Performance',
      //   labels: ['Daily APY', 'Daily APR'],
      //   data: [
      //     // @ts-ignore TYPE NEEDS FIXING
      //     data.map((d) => ({
      //       date: d.date * 1000,
      //       value: d.APY,
      //     })),
      //     // @ts-ignore TYPE NEEDS FIXING
      //     data.map((d) => ({
      //       date: d.date * 1000,
      //       value: d.APR,
      //     })),
      //   ],
      // },
      {
        title: 'Daily Fees Received on Mainnet',
        labels: ['Fees (USD)'],
        data: [
          // @ts-ignore TYPE NEEDS FIXING
          data.map((d) => ({
            date: d.date * 1000,
            value: d.feesReceived,
          })),
        ],
      },
      {
        title: 'xSushi Supply Movements',
        labels: ['Daily Minted', 'Daily Burned'],
        data: [
          // @ts-ignore TYPE NEEDS FIXING
          data.map((d) => ({
            date: d.date * 1000,
            value: d.sushiStaked,
          })),
          // @ts-ignore TYPE NEEDS FIXING
          data.map((d) => ({
            date: d.date * 1000,
            value: d.sushiHarvested,
          })),
        ],
      },
      {
        title: 'xSushi Total Supply',
        labels: ['Supply'],
        data: [
          // @ts-ignore TYPE NEEDS FIXING
          data.map((d) => ({
            date: d.date * 1000,
            value: d.xSushiSupply,
          })),
        ],
      },
    ],
    [data]
  )

  return (
    <>
      <NextSeo title={`Farm Analytics`} />

      <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
        <div>
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            {i18n._(t`xSUSHI Analytics.`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(t`Find out all about xSushi here.`)}
          </Typography>
        </div>
      </TridentHeader>

      <TridentBody>
        <div className="space-y-5">
          <div className="grid grid-flow-col gap-4 overflow-auto grid-col-4">
            <InfoCard text="Price" number={formatNumber(xSushiPrice ?? 0, true)} />
            <InfoCard text="Market Cap" number={formatNumber(xSushiMarketcap ?? 0, true, false)} />
            <InfoCard text="Total Supply" number={formatNumber(bar?.totalSupply)} />
            <InfoCard text="xSUSHI : SUSHI" number={Number(bar?.ratio ?? 0)?.toFixed(4)} />
          </div>
          <div className="grid grid-flow-col gap-4 overflow-auto grid-col-4">
            <InfoCard text="APY 1m" number={formatPercent(apy1m)} />
            <InfoCard text="APY 3m" number={formatPercent(apy3m)} />
            <InfoCard text="APY 6m" number={formatPercent(apy6m)} />
            <InfoCard text="APY 1y" number={formatPercent(apy1y)} />
          </div>
          <div className="space-y-4">
            {graphs.map((graph, i) => (
              <div
                className={classNames(
                  graph.data[0].length === 0 && 'hidden',
                  'p-1 border border-dark-900 rounded shadow-md bg-[rgba(0,0,0,0.12)]'
                )}
                key={i}
              >
                <div className="w-full h-96">
                  <TimespanGraph
                    labels={graph.labels}
                    title={graph.title}
                    timespans={chartTimespans}
                    defaultTimespan="1M"
                    data={graph.data}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </TridentBody>
    </>
  )
}
