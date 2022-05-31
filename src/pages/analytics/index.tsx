import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import TokenTable from 'app/features/analytics/bentobox/TokenTable'
import ChartCard from 'app/features/analytics/ChartCard'
import PoolTable from 'app/features/analytics/pools/PoolTable'
import useFarmRewards from 'app/hooks/useFarmRewards'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { useDayData, useFactory, useOneDayBlock, useTwoDayBlock } from 'app/services/graph'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useMemo } from 'react'

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

export default function Analytics(): JSX.Element {
  const { i18n } = useLingui()
  const router = useRouter()
  const chainId = Number(router.query.chainId)

  const { data: block1d } = useOneDayBlock({ chainId, shouldFetch: !!chainId })
  const { data: block2d } = useTwoDayBlock({ chainId, shouldFetch: !!chainId })

  // For the charts
  const exchange = useFactory({ chainId, shouldFetch: !!chainId })
  const exchange1d = useFactory({ chainId, variables: { block: block1d } })
  const exchange2d = useFactory({ chainId, variables: { block: block2d } })

  const dayData = useDayData({ chainId, shouldFetch: !!chainId })

  const chartData = useMemo(
    () => ({
      liquidity: exchange?.liquidityUSD,
      liquidityChange: (exchange1d?.liquidityUSD / exchange2d?.liquidityUSD) * 100 - 100,
      liquidityChart: dayData
        // @ts-ignore TYPE NEEDS FIXING
        ?.sort((a, b) => a.date - b.date)
        // @ts-ignore TYPE NEEDS FIXING
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.liquidityUSD) })),

      volume1d: exchange?.volumeUSD - exchange1d?.volumeUSD,
      volume1dChange:
        ((exchange?.volumeUSD - exchange1d?.volumeUSD) / (exchange1d?.volumeUSD - exchange2d?.volumeUSD)) * 100 - 100,
      volumeChart: dayData
        // @ts-ignore TYPE NEEDS FIXING
        ?.sort((a, b) => a.date - b.date)
        // @ts-ignore TYPE NEEDS FIXING
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.volumeUSD) })),
    }),
    [exchange, exchange1d, exchange2d, dayData]
  )

  // For Top Farms
  const farms = useFarmRewards({ chainId })

  return (
    <>
      <NextSeo title={`Sushi Analytics`} />
      <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
        <div>
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            {i18n._(t`Sushi Analytics.`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(t`Dive deeper in the analytics of Sushi Bar, BentoBox, Pools, Farms and Tokens.`)}
          </Typography>
        </div>
      </TridentHeader>

      <TridentBody>
        <div className="flex flex-col w-full gap-10">
          <div className="text-2xl font-bold text-high-emphesis">Overview</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ChartCard
              header="TVL"
              subheader="SUSHI AMM"
              figure={chartData.liquidity}
              change={chartData.liquidityChange}
              chart={chartData.liquidityChart}
              defaultTimespan="1M"
              timespans={chartTimespans}
            />
            <ChartCard
              header="Volume"
              subheader="SUSHI AMM"
              figure={chartData.volume1d}
              change={chartData.volume1dChange}
              chart={chartData.volumeChart}
              defaultTimespan="1M"
              timespans={chartTimespans}
            />
          </div>
          <div className="pt-4">
            <PoolTable chainId={chainId} />
            <TokenTable chainId={chainId} />
          </div>
        </div>
      </TridentBody>
    </>
  )
}
