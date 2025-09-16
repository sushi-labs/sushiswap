'use client'

import { PlusIcon } from '@heroicons/react-v1/solid'
import type { V3Pool } from '@sushiswap/graph-client/data-api'
import { useBreakpoint } from '@sushiswap/hooks'
import {
  Button,
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardGroup,
  CardHeader,
  CardTitle,
  Container,
  classNames,
} from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { useConcentratedLiquidityPoolStats } from 'src/lib/hooks/react-query'
import { useConcentratedLiquidityPoolReserves } from 'src/lib/wagmi/hooks/pools/hooks/useConcentratedLiquidityPoolReserves'
import { useConcentratedLiquidityPositions } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedLiquidityPositions'
import { ChainKey, SushiSwapProtocol } from 'sushi'
import { unwrapToken } from 'sushi/currency'
import { Token } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import { Wrapper } from '../swap/trade/wrapper'
import { APRChart } from './APRChart'
import { ConcentratedLiquidityProvider } from './ConcentratedLiquidityProvider'
import { ManagePositionButton } from './ManagePositionButton'
import { Pool24HVolume } from './Pool24HVolume'
import { PoolAPR } from './PoolAPR'
import { PoolPrice } from './PoolPrice'
import { PoolTransactionsV3 } from './PoolTransactionsV3'
import { StatisticsChartsV3 } from './StatisticsChartV3'
import { AddLiquidityDialog } from './add-liquidity/add-liquidity-dialog'

const PoolPageV3: FC<{ pool: V3Pool }> = ({ pool }) => {
  return (
    <ConcentratedLiquidityProvider>
      <Pool pool={pool} />
    </ConcentratedLiquidityProvider>
  )
}

const Pool: FC<{ pool: V3Pool }> = ({ pool }) => {
  const { chainId, address } = pool
  const { isMd } = useBreakpoint('md')
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

  const { data: positions } = useConcentratedLiquidityPositions({
    account: address,
    chainIds: [chainId],
  })

  const [token0, token1] = useMemo(() => {
    if (!pool) return [undefined, undefined]

    return [
      unwrapToken(
        new Token({
          chainId: pool.token0.chainId,
          address: pool.token0.address,
          decimals: pool.token0.decimals,
          symbol: pool.token0.symbol,
          name: pool.token0.name,
        }),
      ),
      unwrapToken(
        new Token({
          chainId: pool.token1.chainId,
          address: pool.token1.address,
          decimals: pool.token1.decimals,
          symbol: pool.token1.symbol,
          name: pool.token1.name,
        }),
      ),
    ]
  }, [pool])

  return (
    <Container
      maxWidth="screen-3xl"
      className="flex flex-col gap-4 px-4 lg:gap-6"
    >
      <div className="flex flex-col-reverse gap-4 w-full lg:gap-10 lg:flex-row">
        <div className="flex-[2_2_0%] min-[1230px]:flex-[3_3_0%] min-w-0 flex flex-col gap-4 lg:gap-6">
          <APRChart />
          <StatisticsChartsV3 address={address} chainId={chainId} pool={pool} />
        </div>
        <div className="flex-[1_1_0%] min-[1230px]:flex-[1_1_0%] h-fit min-w-0 flex flex-col gap-3">
          <div
            className={classNames(
              'flex flex-col gap-3',
              !isMd && !positions?.length && 'hidden',
            )}
          >
            {isMd ? (
              <AddLiquidityDialog
                poolType={SushiSwapProtocol.SUSHISWAP_V3}
                hidePoolTypeToggle={true}
                hideTokenSelectors={true}
                token0={token0}
                token1={token1}
                initFeeAmount={pool.swapFee * 1000000}
                trigger={
                  <Button size="lg" className="w-full h-[52px]">
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Liquidity</span>
                  </Button>
                }
                chainId={pool.chainId}
              />
            ) : null}
            {positions?.length ? (
              <ManagePositionButton
                href={`/${ChainKey[pool.chainId]}/pool/v3/${pool.address}/positions`}
                positionCount={positions?.length}
              />
            ) : null}
          </div>
          <PoolAPR version="v3" pool={pool} />
          <Wrapper enableBorder className="!p-4 flex flex-col gap-5">
            <CardHeader className="!p-0 flex !flex-row justify-between items-center lg:items-start lg:!flex-col gap-2">
              <CardTitle className="text-slate-900 dark:lg:!text-slate-500 dark:!text-slate-100">
                TVL
              </CardTitle>

              <CardDescription className="!mt-0 font-bold lg:font-medium text-sm  lg:!text-2xl flex items-center">
                {formatUSD(fiatValues[0] + fiatValues[1])}{' '}
                <span
                  className={classNames(
                    'text-sm lg:text-base font-medium',
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
              <CardGroup className="lg:!gap-6">
                <CardCurrencyAmountItem
                  isLoading={isReservesLoading}
                  amount={reserves?.[0]}
                  fiatValue={formatUSD(fiatValues[0])}
                  amountClassName="!font-medium"
                />
                <CardCurrencyAmountItem
                  isLoading={isReservesLoading}
                  amount={reserves?.[1]}
                  fiatValue={formatUSD(fiatValues[1])}
                  amountClassName="!font-medium"
                />
              </CardGroup>
            </CardContent>
          </Wrapper>
          <Pool24HVolume pool={pool} />
          <PoolPrice pool={pool} showRate />
        </div>
      </div>

      <div className="flex gap-6 lg:gap-10 lg:flex-row">
        <div className="flex-[2_2_0%] min-[1230px]:flex-[3_3_0%] min-w-0">
          <PoolTransactionsV3 pool={pool} poolAddress={address} />
        </div>
        <div className="flex-[1_1_0%] min-[1230px]:flex-[1_1_0%] min-w-0 lg:block hidden" />
      </div>
    </Container>
  )
}

export { PoolPageV3 }
