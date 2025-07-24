'use client'

import type { V3Pool } from '@sushiswap/graph-client/data-api'
import {
  Card,
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardGroup,
  CardHeader,
  CardLabel,
  CardTitle,
  Container,
  LinkInternal,
  Message,
  Separator,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import type { FC } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { useConcentratedLiquidityPoolStats } from 'src/lib/hooks/react-query'
import { useConcentratedLiquidityPoolReserves } from 'src/lib/wagmi/hooks/pools/hooks/useConcentratedLiquidityPoolReserves'
import { ChainKey } from 'sushi'
import { formatUSD } from 'sushi/format'
import { Wrapper } from '../swap/trade/wrapper'
import { APRChart } from './APRChart'
import { ConcentratedLiquidityProvider } from './ConcentratedLiquidityProvider'
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

  console.log('poolStats', poolStats)
  console.log('reserves', reserves)
  return (
    <Container maxWidth="screen-3xl" className="flex flex-col gap-4 px-4">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-[3_3_0%] min-w-0 flex flex-col gap-6">
          <APRChart />

          <StatisticsChartsV3 address={address} chainId={chainId} pool={pool} />
        </div>
        <div className="flex-[1_1_0%] min-w-0 flex flex-col gap-6">
          <Wrapper enableBorder className="!p-0">
            <CardHeader className="!px-5 flex flex-col gap-1">
              <CardTitle>TVL</CardTitle>
              <CardDescription className="!mt-0 font-medium !text-2xl flex items-center">
                {formatUSD(fiatValues[0] + fiatValues[1])}{' '}
                <span
                  className={classNames(
                    'text-base',
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
            <CardContent className="!px-5">
              <CardGroup className="!gap-6">
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
          <Wrapper enableBorder className="!p-0">
            <CardHeader className="!px-5 !pb-3">
              <CardTitle>
                <div className="flex flex-col gap-y-4 justify-between md:flex-row">
                  24H Volume
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="!p-5 !pt-0">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  {poolStats ? (
                    <div className="flex gap-1 items-center text-2xl font-semibold">
                      {formatUSD(poolStats.volumeUSD1d ?? 0)}{' '}
                      <span
                        className={classNames(
                          'text-base',
                          poolStats['volumeUSD1dChange'] > 0
                            ? 'text-green'
                            : 'text-red',
                        )}
                      >
                        ({poolStats['volumeUSD1dChange'].toFixed(2)}
                        %)
                      </span>
                    </div>
                  ) : (
                    <SkeletonText />
                  )}
                </div>
                {/* <div>
                  <CardLabel>Fees (24h)</CardLabel>
                  {poolStats ? (
                    <div className="text-xl font-semibold">
                      {formatUSD(poolStats.feesUSD1d ?? 0)}{' '}
                      <span
                        className={classNames(
                          'text-xs',
                          poolStats['feesUSD1dChange'] > 0
                            ? 'text-green'
                            : 'text-red',
                        )}
                      >
                        ({poolStats['feesUSD1dChange'].toFixed(2)}
                        %)
                      </span>
                    </div>
                  ) : (
                    <SkeletonText />
                  )}
                </div> */}
              </div>
            </CardContent>
          </Wrapper>
        </div>
      </div>
      <div className="py-4">
        <Separator />
      </div>
      <PoolRewardDistributionsCard pool={pool} />
      <PoolTransactionsV3 pool={pool} poolAddress={address} />
    </Container>
  )
}

export { PoolPageV3 }
