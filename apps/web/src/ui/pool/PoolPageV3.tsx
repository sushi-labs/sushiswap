'use client'

import type { V3Pool } from '@sushiswap/graph-client/data-api'
import {
  Card,
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardGroup,
  CardHeader,
  CardItem,
  CardLabel,
  CardTitle,
  Container,
  Currency,
  Separator,
  SkeletonText,
  Switch,
  classNames,
} from '@sushiswap/ui'
import type { FC } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { useConcentratedLiquidityPoolStats } from 'src/lib/hooks/react-query'
import { useConcentratedLiquidityPoolReserves } from 'src/lib/wagmi/hooks/pools/hooks/useConcentratedLiquidityPoolReserves'
import { formatUSD } from 'sushi/format'
import { Wrapper } from '../swap/trade/wrapper'
import { APRChart } from './APRChart'
import { ConcentratedLiquidityProvider } from './ConcentratedLiquidityProvider'
import { Pool24HVolume } from './Pool24HVolume'
import { PoolAPR } from './PoolAPR'
import { PoolPrice } from './PoolPrice'
import { PoolRewardDistributionsCard } from './PoolRewardDistributionsCard'
import { PoolTransactionsV3 } from './PoolTransactionsV3'
import { StatisticsChartsV3 } from './StatisticsChartV3'

const PoolPageV3: FC<{ pool: V3Pool }> = ({ pool }) => {
  return (
    <ConcentratedLiquidityProvider>
      <Pool pool={pool} />
    </ConcentratedLiquidityProvider>
  )
}

const Pool: FC<{ pool: V3Pool }> = ({ pool }) => {
  const { chainId, address } = pool

  const { data: poolStats } = useConcentratedLiquidityPoolStats({
    chainId,
    address,
  })

  const { data: reserves, isLoading: isReservesLoading } =
    useConcentratedLiquidityPoolReserves({
      pool,
      chainId,
    })
  const fiatValues = useTokenAmountDollarValues({ chainId, amounts: reserves })

  return (
    <Container maxWidth="screen-3xl" className="flex flex-col gap-4 px-4">
      <div className="flex flex-col-reverse gap-6 md:flex-row">
        <div className="min-[1230px]:flex-[3_3_0%] min-[1230px]:flex-[2_2_0%] min-w-0 flex flex-col gap-6">
          <APRChart />

          <StatisticsChartsV3 address={address} chainId={chainId} pool={pool} />
        </div>
        <div className="flex-[1_1_0%] min-w-0 flex flex-col gap-6">
          <PoolAPR />

          <Wrapper enableBorder className="!p-3 flex flex-col gap-5">
            <CardHeader className="!p-0 flex !flex-row justify-between items-center md:flex-col gap-1">
              <CardTitle className="text-slate-900">TVL</CardTitle>

              <CardDescription className="!mt-0 font-bold md:font-medium text-sm  md:!text-2xl flex items-center">
                {formatUSD(fiatValues[0] + fiatValues[1])}{' '}
                <span
                  className={classNames(
                    'text-sm md:text-base font-medium',
                    poolStats?.liquidityUSD1dChange &&
                      poolStats?.liquidityUSD1dChange > 0
                      ? 'text-green'
                      : 'text-red',
                  )}
                >
                  ({poolStats?.liquidityUSD1dChange.toFixed(2)}%)
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent className="!p-0">
              <CardGroup className="md:!gap-6">
                <div className="hidden justify-between items-center md:flex">
                  <span className="text-base text-gray-500 md:flex-row dark:text-slate-500">
                    Show stablecoin types
                  </span>
                  <Switch />
                </div>
                <CardCurrencyAmountItem
                  isLoading={isReservesLoading}
                  amount={reserves?.[0]}
                  fiatValue={formatUSD(fiatValues[0])}
                />
                <CardCurrencyAmountItem
                  isLoading={isReservesLoading}
                  amount={reserves?.[1]}
                  fiatValue={formatUSD(fiatValues[1])}
                />
              </CardGroup>
            </CardContent>
          </Wrapper>
          <Pool24HVolume pool={pool} />
          <PoolPrice pool={pool} />
        </div>
      </div>

      <PoolRewardDistributionsCard pool={pool} />
      <PoolTransactionsV3 pool={pool} poolAddress={address} />
    </Container>
  )
}

export { PoolPageV3 }
