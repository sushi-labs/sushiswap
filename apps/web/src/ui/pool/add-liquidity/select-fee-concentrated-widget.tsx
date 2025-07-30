import { RadioGroup } from '@headlessui/react'
import type { V3Pool } from '@sushiswap/graph-client/data-api'
import {
  FeePoolSelectAction,
  LiquidityEventName,
  sendAnalyticsEvent,
  useTrace,
} from '@sushiswap/telemetry'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Chip,
  Toggle,
  classNames,
} from '@sushiswap/ui'
import { Dots } from '@sushiswap/ui'
import React, { type FC, memo, useCallback, useMemo } from 'react'
import { useV3Pools } from 'src/lib/hooks/api/use-v3-pools'
import { usePoolsByTokenPair } from 'src/lib/hooks/usePoolsByTokenPair'
import { SushiSwapV3FeeAmount } from 'sushi/config'
import type { Type } from 'sushi/currency'
import { formatPercent } from 'sushi/format'
import { APRHoverCard } from '../APRHoverCard'

export const FEE_OPTIONS = [
  {
    value: SushiSwapV3FeeAmount.LOWEST,
    subtitle: 'Best for very stable pairs.',
  },
  {
    value: SushiSwapV3FeeAmount.LOW,
    subtitle: 'Best for less volatile pairs.',
  },
  {
    value: SushiSwapV3FeeAmount.MEDIUM,
    subtitle: 'Best for most pairs.',
  },
  {
    value: SushiSwapV3FeeAmount.HIGH,
    subtitle: 'Best for volatile pairs.',
  },
]

interface SelectFeeConcentratedWidget {
  feeAmount: SushiSwapV3FeeAmount | undefined
  setFeeAmount: (fee: SushiSwapV3FeeAmount) => void
  token0: Type | undefined
  token1: Type | undefined
  title?: string
}

export const SelectFeeConcentratedWidget: FC<SelectFeeConcentratedWidget> =
  memo(function SelectFeeWidget({
    feeAmount,
    setFeeAmount: _setFeeAmount,
    token0,
    token1,
  }) {
    const trace = useTrace()

    const setFeeAmount = useCallback(
      (fee: SushiSwapV3FeeAmount) => {
        _setFeeAmount(fee)
        sendAnalyticsEvent(LiquidityEventName.SELECT_LIQUIDITY_POOL_FEE_TIER, {
          chain_id: token0?.chainId,
          label: [token0?.symbol, token1?.symbol].join('/'),
          action: FeePoolSelectAction.MANUAL,
          fee,
          ...trace,
        })
      },
      [_setFeeAmount, trace, token0?.chainId, token0?.symbol, token1?.symbol],
    )
    const { data: pools, isLoading: isLoadingPools } = usePoolsByTokenPair(
      token0?.wrapped.id,
      token1?.wrapped.id,
    )
    const poolAddressesChainIds = useMemo(() => {
      return (
        pools?.map((pool) => ({
          address: pool.address,
          chainId: pool.chainId,
        })) ?? []
      )
    }, [pools])
    const { data: v3Pools, isLoading: isLoadingV3Pools } = useV3Pools(
      poolAddressesChainIds,
      Boolean(token0 && token1),
    )
    const isLoading = isLoadingPools || isLoadingV3Pools

    const poolByFee = useMemo(() => {
      const poolMap = new Map<SushiSwapV3FeeAmount, V3Pool>()
      v3Pools?.forEach((pool) => {
        const feeOption = FEE_OPTIONS.find(
          (option) => option.value / 1_000_000 === pool.swapFee,
        )
        if (!feeOption) return

        poolMap.set(feeOption.value, pool)
      })
      return poolMap
    }, [v3Pools])

    const tvlDistribution = useMemo(() => {
      const tvlDistribution = new Map<
        (typeof FEE_OPTIONS)[number]['value'],
        number
      >()

      if (!pools) return tvlDistribution

      const totalTvl = pools?.reduce(
        (acc, pool) => acc + Number(pool.liquidityUSD),
        0,
      )

      pools?.forEach((pool) => {
        const feeOption = FEE_OPTIONS.find(
          (option) => option.value / 1_000_000 === pool.swapFee,
        )
        if (!feeOption) return

        const tvlShare = pool.liquidityUSD / totalTvl
        if (Number.isNaN(tvlShare)) return
        tvlDistribution.set(feeOption.value, tvlShare)
      })

      return tvlDistribution
    }, [pools])

    return (
      <div className="flex flex-col w-full gap-1.5">
        <p className="font-medium text-slate-900 md:text-slate-450 dark:text-pink-100 md:dark:text-slate-500 text-sm">
          Fee Tier
        </p>
        <div className={!token0 || !token1 ? 'opacity-40' : ''}>
          <RadioGroup
            value={feeAmount}
            onChange={setFeeAmount}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            disabled={!token0 || !token1}
          >
            {FEE_OPTIONS.map((option, i) => {
              const pool = poolByFee.get(option.value)
              const totalApr = (pool?.feeApr1d || 0) + (pool?.incentiveApr || 0)
              const isHighestApr =
                totalApr ===
                Math.max(
                  ...Array.from(poolByFee.values()).map(
                    (p) => (p.feeApr1d || 0) + (p.incentiveApr || 0),
                  ),
                )

              return (
                <Toggle
                  pressed={feeAmount === option.value}
                  onClick={() => setFeeAmount(option.value)}
                  asChild
                  key={i}
                  testdata-id={`fee-option-${option.value}`}
                  className={classNames(
                    '!h-[unset] !w-[unset] !p-0 !text-left !justify-start cursor-pointer dark:data-[state=off]:bg-[#FFFFFF05] data-[state=off]:bg-[#00000005] dark:data-[state=on]:bg-skyblue/[0.08] dark:data-[state=on]:border-skyblue data-[state=on]:bg-blue/[0.08] data-[state=on]:border-blue',
                    feeAmount !== option.value &&
                      !tvlDistribution.get(option.value)
                      ? 'opacity-60'
                      : '',
                  )}
                >
                  <Card>
                    <CardHeader className="w-full">
                      <CardTitle className="w-full">
                        <div className="flex flex-row w-full md:flex-col gap-2">
                          <span className="text-lg font-semibold text-slate-900 dark:text-pink-100">
                            {option.value / 10000}% Fees
                          </span>
                          {tvlDistribution.get(option.value) ? (
                            <Chip
                              variant="secondary"
                              className="w-fit !rounded-full text-slate-900 !text-xs font-medium bg-slate-200 dark:bg-slate-750 dark:text-pink-100"
                            >
                              {isLoading ? (
                                <Dots />
                              ) : (
                                `${(tvlDistribution.get(option.value)! * 100)?.toFixed(0)}% Selected`
                              )}
                            </Chip>
                          ) : (
                            <div className="h-[20px] w-[98px]" />
                          )}

                          <div className="font-semibold items-center text-slate-900 dark:text-pink-100 flex ml-auto md:hidden">
                            APR:{' '}
                            <span>
                              {pool ? (
                                <APRHoverCard pool={pool}>
                                  <span className="underline decoration-dotted underline-offset-2">
                                    {formatPercent(totalApr)}{' '}
                                    {isHighestApr ? '✨' : ''}
                                  </span>
                                </APRHoverCard>
                              ) : (
                                '-'
                              )}
                            </span>
                          </div>
                        </div>
                      </CardTitle>
                      <CardDescription className="dark:!text-slate-500 !text-slate-450 flex flex-col gap-1">
                        {option.subtitle}
                        <div className="font-semibold items-center text-slate-900 dark:text-pink-100 hidden md:flex">
                          APR:{' '}
                          <span>
                            {pool ? (
                              <APRHoverCard pool={pool}>
                                <span className="underline decoration-dotted underline-offset-2">
                                  {formatPercent(totalApr)}{' '}
                                  {isHighestApr ? '✨' : ''}
                                </span>
                              </APRHoverCard>
                            ) : (
                              '-'
                            )}
                          </span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Toggle>
              )
            })}
          </RadioGroup>
        </div>
      </div>
    )
  })
