'use client'

import { RadioGroup } from '@headlessui/react'
import {
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react-v1/solid'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Chip,
  FormSection,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  LinkInternal,
  TextField,
  Toggle,
  classNames,
} from '@sushiswap/ui'
import { Dots } from '@sushiswap/ui'
import React, {
  type FC,
  memo,
  startTransition,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useV4PoolsByTokenPair } from 'src/lib/hooks/react-query/pools/useV4PoolsByTokenPair'
import { MAX_TICK_SPACING, type SushiSwapV4ChainId } from 'src/lib/pool/v4'
import {
  SushiSwapV3FeeAmount,
  TICK_SPACINGS as V3_TICK_SPACINGS,
} from 'sushi/config'
import type { Type } from 'sushi/currency'
import { formatUnits, parseUnits } from 'viem/utils'
import type { FeeData } from './ConcentratedLiquidityURLStateProviderV4'

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

interface SelectFeeConcentratedWidgetV4 {
  feeAmount: number | undefined
  setFeeAmount: (fee: number) => void
  tickSpacing: number | undefined
  setTickSpacing: (tickSpacing: number) => void
  setFeeData: (feeData: FeeData) => void
  chainId: SushiSwapV4ChainId
  token0: Type | undefined
  token1: Type | undefined
  title?: string
  disableIfNotExists?: boolean
}

export const SelectFeeConcentratedWidgetV4: FC<SelectFeeConcentratedWidgetV4> =
  memo(function SelectFeeWidget({
    feeAmount,
    setFeeAmount,
    tickSpacing,
    setTickSpacing,
    setFeeData,
    chainId,
    token0,
    token1,
    disableIfNotExists = false,
  }) {
    const [customFeeEnabled, setCustomFeeEnabled] = useState<boolean>(
      Boolean(
        feeAmount && !Object.values(SushiSwapV3FeeAmount).includes(feeAmount),
      ),
    )

    const { data: pools, isLoading } = useV4PoolsByTokenPair(
      chainId,
      token0?.id,
      token1?.id,
    )

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
      <FormSection
        title="Fee tier"
        description="Some fee tiers work better than others depending on the volatility of your pair. Lower fee tiers generally work better when pairing stable coins. Higher fee tiers generally work better when pairing exotic coins."
      >
        <div
          className={classNames(
            !token0 || !token1 ? 'opacity-40' : '',
            'flex flex-col gap-4',
          )}
        >
          <div className="grid grid-cols-2 gap-4">
            {FEE_OPTIONS.map((option, i) =>
              disableIfNotExists && !tvlDistribution.get(option.value) ? (
                <HoverCard key={i} openDelay={0} closeDelay={0}>
                  <HoverCardTrigger>
                    <Card className="opacity-40">
                      <CardHeader>
                        <CardTitle>
                          <span className="flex flex-wrap items-center gap-2">
                            <span>{option.value / 10000}% Fees</span>
                            {tvlDistribution.get(option.value) && (
                              <Chip variant="secondary">
                                {isLoading ? (
                                  <Dots />
                                ) : (
                                  `${(
                                    tvlDistribution.get(option.value)! * 100
                                  )?.toFixed(0)}% Selected`
                                )}
                              </Chip>
                            )}
                          </span>
                        </CardTitle>
                        <CardDescription>{option.subtitle}</CardDescription>
                      </CardHeader>
                    </Card>
                  </HoverCardTrigger>
                  <HoverCardContent className="!p-0">
                    <CardHeader>
                      <CardTitle>Pool doesnt exist yet.</CardTitle>
                      <CardDescription>
                        A pool for this fee tier {`doesn't`} exist yet. <br />{' '}
                        Anyone can create a pool. Want to
                        <br />
                        create this pool first?
                      </CardDescription>
                    </CardHeader>
                    {token0 && token1 ? (
                      <CardFooter>
                        <Button
                          asChild
                          icon={ChevronRightIcon}
                          size="sm"
                          variant="secondary"
                        >
                          <LinkInternal
                            href={`/pool/add?chainId=${
                              token0.chainId
                            }&feeAmount=${option.value}&fromCurrency=${
                              token0.isNative
                                ? 'NATIVE'
                                : token0.wrapped.address
                            }&toCurrency=${
                              token1.isNative
                                ? 'NATIVE'
                                : token1.wrapped.address
                            }`}
                          >
                            Create Pool
                          </LinkInternal>
                        </Button>
                      </CardFooter>
                    ) : null}
                  </HoverCardContent>
                </HoverCard>
              ) : (
                <Toggle
                  pressed={!customFeeEnabled && feeAmount === option.value}
                  onClick={() => {
                    if (customFeeEnabled) setCustomFeeEnabled(false)
                    setFeeData({
                      feeAmount: option.value,
                      tickSpacing: V3_TICK_SPACINGS[option.value],
                    })
                  }}
                  asChild
                  key={i}
                  testdata-id={`fee-option-${option.value}`}
                  className="!h-[unset] !w-[unset] !p-0 !text-left !justify-start cursor-pointer dark:data-[state=on]:bg-secondary"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <span className="flex flex-wrap items-center gap-2">
                          <span>{option.value / 10000}% Fees</span>
                          {tvlDistribution.get(option.value) && (
                            <Chip variant="secondary">
                              {isLoading ? (
                                <Dots />
                              ) : (
                                `${(
                                  tvlDistribution.get(option.value)! * 100
                                )?.toFixed(0)}% Selected`
                              )}
                            </Chip>
                          )}
                        </span>
                      </CardTitle>
                      <CardDescription>{option.subtitle}</CardDescription>
                    </CardHeader>
                  </Card>
                </Toggle>
              ),
            )}
          </div>
          <CustomFees
            setFeeAmount={setFeeAmount}
            setTickSpacing={setTickSpacing}
            tickSpacing={tickSpacing}
            enabled={Boolean(token0 && token1 && customFeeEnabled)}
            setEnabled={setCustomFeeEnabled}
            feeAmount={feeAmount}
            setFeeData={setFeeData}
          />
        </div>
      </FormSection>
    )
  })

interface CustomFees
  extends Pick<
    SelectFeeConcentratedWidgetV4,
    | 'feeAmount'
    | 'tickSpacing'
    | 'setFeeAmount'
    | 'setTickSpacing'
    | 'setFeeData'
  > {
  enabled: boolean
  setEnabled: (enabled: boolean) => void
}

const CustomFees: FC<CustomFees> = ({
  feeAmount,
  setFeeAmount,
  tickSpacing,
  setTickSpacing,
  setFeeData,
  enabled,
  setEnabled,
}) => {
  const [customFeeAmount, _setCustomFeeAmount] = useState<string>(
    !feeAmount || feeAmount in V3_TICK_SPACINGS
      ? ''
      : formatUnits(BigInt(feeAmount), 4).toString(),
  )
  const [customTickSpacing, _setCustomTickSpacing] = useState<string>(
    !tickSpacing || !feeAmount || feeAmount in V3_TICK_SPACINGS
      ? ''
      : tickSpacing.toString(),
  )

  const setCustomFeeAmount = (value: string) => {
    _setCustomFeeAmount(value)

    const parsed = Number.parseFloat(value)
    if (Number.isNaN(parsed)) return

    const feeAmount = Number(parseUnits(parsed.toFixed(4), 4))
    setFeeAmount(Number(feeAmount))

    if (feeAmount in V3_TICK_SPACINGS) {
      setCustomTickSpacing(
        V3_TICK_SPACINGS[feeAmount as SushiSwapV3FeeAmount].toString(),
      )
    }
  }

  const setCustomTickSpacing = (value: string) => {
    _setCustomTickSpacing(value)
    const tickSpacing = Number(value)
    if (Number.isNaN(tickSpacing)) return
    setTickSpacing(tickSpacing)
  }

  const feeAmountInputRef = useRef<HTMLInputElement>(null)

  const onEnable = () => {
    setEnabled(true)

    const fee = +customFeeAmount
    const tickSpacing = +customTickSpacing

    if (!fee || !tickSpacing) return

    const parsedFee = Number.parseFloat(customFeeAmount)
    if (Number.isNaN(parsedFee)) return

    const feeAmount = Number(parseUnits(parsedFee.toFixed(4), 4))

    setFeeData({ feeAmount, tickSpacing })
  }

  return (
    <Toggle
      asChild
      pressed={enabled}
      onClick={(e) => {
        onEnable()
        if ((e.target as HTMLElement).tagName === 'INPUT') return

        const input = (e.target as HTMLElement)
          .closest('div')
          ?.querySelector('input')
        if (input instanceof HTMLInputElement) {
          requestAnimationFrame(() => input.focus())
        }
      }}
      testdata-id={`fee-option-custom`}
      className="!h-[unset] !w-[unset] !p-6 !text-left !items-start !justify-start cursor-pointer dark:data-[state=on]:bg-secondary border border-accent"
    >
      <div className="flex w-full flex-col gap-2.5">
        <span className="text-muted-foreground font-medium">Custom</span>
        <div className="flex flex-col gap-5 sm:flex-row">
          <Card className="flex-1" as="div">
            <CardHeader>
              <CardTitle>Fee Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <TextField
                  ref={feeAmountInputRef}
                  variant="naked"
                  testdata-id={`custom-fee-input`}
                  type="number"
                  value={customFeeAmount}
                  onValueChange={(value) => setCustomFeeAmount(value)}
                  disabled={!enabled}
                  placeholder={'0.3%'}
                  maxDecimals={2}
                  className="text-xl font-semibold"
                  onClick={onEnable}
                />
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={+customFeeAmount === 0 || !enabled}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCustomFeeAmount(
                        Math.max(0, +customFeeAmount - 0.05).toFixed(2),
                      )
                    }}
                    className={classNames(
                      +customFeeAmount === 0 || !enabled
                        ? 'opacity-40'
                        : 'hover:bg-gray-300 dark:hover:bg-slate-600',
                      'flex items-center justify-center w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded-full',
                    )}
                  >
                    <MinusIcon width={12} height={12} />
                  </button>
                  <button
                    type="button"
                    disabled={+customFeeAmount === 100 || !enabled}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCustomFeeAmount(
                        Math.min(100, +customFeeAmount + 0.05).toFixed(2),
                      )
                    }}
                    className={classNames(
                      +customFeeAmount === 100 || !enabled
                        ? 'opacity-40'
                        : 'hover:bg-gray-300 dark:hover:bg-slate-600',
                      'flex items-center justify-center w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded-full',
                    )}
                  >
                    <PlusIcon width={12} height={12} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Tick Spacing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <TextField
                  variant="naked"
                  testdata-id={`custom-fee-input`}
                  type="number"
                  value={customTickSpacing}
                  onValueChange={(value) => setCustomTickSpacing(value)}
                  disabled={!enabled}
                  placeholder={'1'}
                  maxDecimals={0}
                  className="text-xl font-semibold"
                  onClick={onEnable}
                />
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={+customTickSpacing <= 1 || !enabled}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCustomTickSpacing(
                        (+customTickSpacing
                          ? +customTickSpacing - 1
                          : 1
                        ).toString(),
                      )
                    }}
                    className={classNames(
                      +customTickSpacing <= 1 || !enabled
                        ? 'opacity-40'
                        : 'hover:bg-gray-300 dark:hover:bg-slate-600',
                      'flex items-center justify-center w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded-full',
                    )}
                  >
                    <MinusIcon width={12} height={12} />
                  </button>
                  <button
                    type="button"
                    disabled={
                      +customTickSpacing === Number(MAX_TICK_SPACING) ||
                      !enabled
                    }
                    onClick={(e) => {
                      e.stopPropagation()
                      setCustomTickSpacing(
                        (customTickSpacing
                          ? +customTickSpacing + 1
                          : 1
                        ).toString(),
                      )
                    }}
                    className={classNames(
                      +customTickSpacing === Number(MAX_TICK_SPACING) ||
                        !enabled
                        ? 'opacity-40'
                        : 'hover:bg-gray-300 dark:hover:bg-slate-600',
                      'flex items-center justify-center w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded-full',
                    )}
                  >
                    <PlusIcon width={12} height={12} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Toggle>
  )
}
