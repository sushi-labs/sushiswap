'use client'

import { PlusIcon } from '@heroicons/react-v1/solid'
import { type RawV3Pool, hydrateV3Pool } from '@sushiswap/graph-client/data-api'
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
  LinkInternal,
  classNames,
} from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { useConcentratedLiquidityPoolStats } from 'src/lib/hooks/react-query'
import { useConcentratedLiquidityPoolReserves } from 'src/lib/wagmi/hooks/pools/hooks/useConcentratedLiquidityPoolReserves'
import { useConcentratedLiquidityPositions } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedLiquidityPositions'
import { formatUSD } from 'sushi'
import { EvmToken, getEvmChainById, unwrapEvmToken } from 'sushi/evm'
import { Wrapper } from '~evm/[chainId]/[trade]/_ui/swap/trade/wrapper'
import { APRChart } from '~evm/[chainId]/_ui/APRChart'
import { ManagePositionButton } from '~evm/[chainId]/_ui/ManagePositionButton'
import { Pool24HVolume } from '~evm/[chainId]/_ui/Pool24HVolume'
import { PoolAPR } from '~evm/[chainId]/_ui/PoolAPR'
import { PoolPrice } from '~evm/[chainId]/_ui/PoolPrice'
import { ConcentratedLiquidityProvider } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { PoolTransactionsV3 } from './pool-transactions-v3'
import { StatisticsChartsV3 } from './statistics-chart-v3'

const PoolPageV3: FC<{ pool: RawV3Pool }> = ({ pool }) => {
  return (
    <ConcentratedLiquidityProvider>
      <Pool pool={pool} />
    </ConcentratedLiquidityProvider>
  )
}

const Pool: FC<{ pool: RawV3Pool }> = ({ pool: rawPool }) => {
  const pool = useMemo(() => hydrateV3Pool(rawPool), [rawPool])
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
      unwrapEvmToken(
        new EvmToken({
          chainId: pool.token0.chainId,
          address: pool.token0.address,
          decimals: pool.token0.decimals,
          symbol: pool.token0.symbol,
          name: pool.token0.name,
        }),
      ),
      unwrapEvmToken(
        new EvmToken({
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
          <APRChart pool={rawPool} />
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
              <LinkInternal
                href={`/${getEvmChainById(pool.chainId).key}/pool/v3/${pool.address}/add?feeAmount=${
                  pool.swapFee * 1000000
                }&fromCurrency=${token0?.isNative ? 'NATIVE' : token0?.address}&toCurrency=${
                  token1?.isNative ? 'NATIVE' : token1?.address
                }`}
              >
                <Button size="lg" className="w-full h-[52px]">
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Liquidity</span>
                </Button>
              </LinkInternal>
            ) : null}
            {positions?.length ? (
              <ManagePositionButton
                href={`/${getEvmChainById(pool.chainId).key}/pool/v3/${pool.address}/positions`}
                positionCount={positions?.length}
              />
            ) : null}
          </div>
          <PoolAPR version="v3" pool={rawPool} />
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
              <CardGroup className="lg:!gap-4">
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
          <Pool24HVolume pool={rawPool} />
          <PoolPrice pool={rawPool} showRate />
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
