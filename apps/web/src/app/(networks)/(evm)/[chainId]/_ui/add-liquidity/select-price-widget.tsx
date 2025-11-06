'use client'

import { RadioGroup } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react-v1/solid'
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { useIsMounted } from '@sushiswap/hooks'
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  Explainer,
  Message,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  classNames,
} from '@sushiswap/ui'
import { SkeletonText } from '@sushiswap/ui'
import { Toggle } from '@sushiswap/ui'
import React, { type FC, useCallback, useMemo, useState } from 'react'
import { Bound, Field } from 'src/lib/constants'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { useConcentratedLiquidityPoolStats } from 'src/lib/hooks/react-query'
import { useConcentratedLiquidityPositionsFromTokenId } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionsFromTokenId'
import { Amount, Fraction, formatPercent } from 'sushi'
import {
  type EvmAddress,
  type EvmCurrency,
  type SushiSwapV3ChainId,
  type SushiSwapV3FeeAmount,
  TICK_SPACINGS,
  getCapitalEfficiency,
  getTokenRatio,
  tickToPrice,
} from 'sushi/evm'
import { useAccount } from 'wagmi'
import {
  useConcentratedDerivedMintInfo,
  useConcentratedMintActionHandlers,
  useConcentratedMintState,
  useRangeHopCallbacks,
} from '../concentrated-liquidity-provider'
import { LiquidityChartRangeInput } from './active-liquidity-chart/liquidity-chart-range-input'
import { ConcentratedInitialPrice } from './concentrated-initial-price'
import { PriceBlock } from './price-block'
import { SliderPriceInput } from './slider-price-input'

enum PriceRange {
  FULL_RANGE = 0,
  BPS_20000 = 1,
  BPS_12000 = 2,
  BPS_10100 = 3,
  LEFT_SIDE = 4,
  RIGHT_SIDE = 5,
}

enum YieldRatePeriod {
  ANNUALLY = 0,
  MONTHLY = 1,
  DAILY = 2,
}

const YIELD_RATE_OPTIONS = [
  {
    value: YieldRatePeriod.ANNUALLY,
    label: 'Annually',
  },
  {
    value: YieldRatePeriod.MONTHLY,
    label: 'Monthly',
  },
  {
    value: YieldRatePeriod.DAILY,
    label: 'Daily',
  },
]

interface SelectPriceWidget {
  chainId: SushiSwapV3ChainId
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  poolAddress: EvmAddress | undefined
  feeAmount: SushiSwapV3FeeAmount | undefined
  switchTokens?(): void
  tokenId: string | undefined
  showStartPrice?: boolean
}

export const SelectPriceWidget: FC<SelectPriceWidget> = ({
  chainId,
  token0,
  token1,
  poolAddress,
  feeAmount,
  switchTokens,
  tokenId,
  showStartPrice = true,
}) => {
  const isMounted = useIsMounted()
  const { address } = useAccount()
  const [invert, setInvert] = useState(false)
  const [yieldRate, setYieldRate] = useState<YieldRatePeriod>(
    YieldRatePeriod.ANNUALLY,
  )
  const [priceRange, setPriceRangeSelector] = useState<PriceRange | undefined>(
    undefined,
  )
  const {
    price,
    invertPrice,
    pricesAtTicks,
    ticks,
    ticksAtLimit,
    pool,
    noLiquidity,
    isLoading,
    leftBoundInput,
    outOfRange,
    rightBoundInput,
    parsedAmounts,
    invalidRange,
    dependentField,
  } = useConcentratedDerivedMintInfo({
    chainId,
    account: address,
    token0,
    token1,
    baseToken: token0,
    feeAmount,
    existingPosition: undefined,
  })

  const {
    onLeftRangeInput,
    onRightRangeInput,
    onStartPriceInput,
    onFieldAInput,
    onFieldBInput,
    setWeightLockedCurrencyBase,
    setIndependentRangeField,
  } = useConcentratedMintActionHandlers()
  const {
    startPriceTypedValue,
    independentField,
    independentRangeField,
    typedValue,
    weightLockedCurrencyBase,
  } = useConcentratedMintState()

  const { data: existingPosition, isLoading: positionLoading } =
    useConcentratedLiquidityPositionsFromTokenId({
      chainId,
      tokenId,
    })
  const hasExistingPosition = !!existingPosition && !positionLoading

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

  const {
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
    getSetFullRange,
    resetMintState,
  } = useRangeHopCallbacks(
    token0,
    token1,
    feeAmount,
    tickLower,
    tickUpper,
    pool,
  )

  const setPriceRange = useCallback(
    (multiplierLower: Fraction, multiplierUpper: Fraction) => {
      if (!price) return
      const newPriceLower = price.asFraction
        .mul(price.scalar)
        .mul(multiplierLower)
      const newPriceUpper = price.asFraction
        .mul(price.scalar)
        .mul(multiplierUpper)
      setWeightLockedCurrencyBase(undefined)
      if (invertPrice) {
        onLeftRangeInput(newPriceUpper.invert().toString({ fixed: 18 }))
        onRightRangeInput(newPriceLower.invert().toString({ fixed: 18 }))
      } else {
        onLeftRangeInput(newPriceLower.toString({ fixed: 18 }))
        onRightRangeInput(newPriceUpper.toString({ fixed: 18 }))
      }
    },
    [
      onLeftRangeInput,
      onRightRangeInput,
      price,
      invertPrice,
      setWeightLockedCurrencyBase,
    ],
  )

  const setSingleSided = useCallback(
    (side: 'left' | 'right') => {
      if (!token0 || !token1 || !price || !feeAmount || !pool) return

      getSetFullRange()

      switch (side) {
        case 'left': {
          const current =
            Math.floor(pool.tickCurrent / TICK_SPACINGS[feeAmount]) *
            TICK_SPACINGS[feeAmount]

          const newRightPrice = tickToPrice(
            token0.wrap(),
            token1.wrap(),
            current + (invertPrice ? 1 : 0) * TICK_SPACINGS[feeAmount],
          )
          onRightRangeInput(newRightPrice.toString({ fixed: 18 }))
          break
        }
        case 'right': {
          const current =
            Math.ceil(pool.tickCurrent / TICK_SPACINGS[feeAmount]) *
            TICK_SPACINGS[feeAmount]

          const newLeftPrice = tickToPrice(
            token0.wrap(),
            token1.wrap(),
            current + (invertPrice ? -1 : 0) * TICK_SPACINGS[feeAmount],
          )
          onLeftRangeInput(newLeftPrice.toString({ fixed: 18 }))
          break
        }
      }
    },
    [
      token0,
      token1,
      price,
      feeAmount,
      pool,
      getSetFullRange,
      invertPrice,
      onRightRangeInput,
      onLeftRangeInput,
    ],
  )

  const formattedAmounts: {
    [_formattedAmountsField in Field]: string
  } = useMemo(
    () => ({
      [Field.CURRENCY_A]:
        independentField === Field.CURRENCY_A
          ? typedValue
          : (parsedAmounts[dependentField]?.toSignificant(6) ?? ''),
      [Field.CURRENCY_B]:
        independentField === Field.CURRENCY_A
          ? (parsedAmounts[dependentField]?.toSignificant(6) ?? '')
          : typedValue,
    }),
    [typedValue, dependentField, independentField, parsedAmounts],
  )

  const handleSwitchTokens = useCallback(() => {
    switchTokens?.()

    if (!ticksAtLimit[Bound.LOWER] && !ticksAtLimit[Bound.UPPER]) {
      // switch price
      if (typeof weightLockedCurrencyBase === 'number')
        setWeightLockedCurrencyBase(1 - weightLockedCurrencyBase)
      setIndependentRangeField(
        independentRangeField === Bound.LOWER ? Bound.UPPER : Bound.LOWER,
      )
      onLeftRangeInput(
        (invertPrice ? priceLower : priceUpper?.invert())?.toSignificant(6) ??
          '',
      )
      onRightRangeInput(
        (invertPrice ? priceUpper : priceLower?.invert())?.toSignificant(6) ??
          '',
      )
      if (independentField === Field.CURRENCY_A) {
        onFieldBInput(formattedAmounts[Field.CURRENCY_A] ?? '', noLiquidity)
      } else {
        onFieldAInput(formattedAmounts[Field.CURRENCY_B] ?? '', noLiquidity)
      }
    }
  }, [
    switchTokens,
    ticksAtLimit,
    setWeightLockedCurrencyBase,
    setIndependentRangeField,
    onLeftRangeInput,
    onRightRangeInput,
    weightLockedCurrencyBase,
    invertPrice,
    priceUpper,
    priceLower,
    noLiquidity,
    independentField,
    onFieldAInput,
    onFieldBInput,
    formattedAmounts,
    independentRangeField,
  ])

  const PRICE_RANGE_OPTIONS = useMemo(
    () => [
      {
        label: 'Full Range',
        value: PriceRange.FULL_RANGE,
        onClick: () => {
          setWeightLockedCurrencyBase(undefined)
          getSetFullRange()
        },
        description:
          'This sets the liquidity provision price range from 0 to infinity.',
      },
      {
        label: '0.5× - 2×',
        value: PriceRange.BPS_20000,
        onClick: () =>
          setPriceRange(
            new Fraction({ numerator: 1, denominator: 2 }),
            new Fraction({ numerator: 2, denominator: 1 }),
          ),
        description:
          'While maintaining the 50:50 token deposit ratio, this sets the minimum range to 0.5 * Current Price and the maximum range to 2 * Current Price.',
      },
      {
        label: '0.83× - 1.2×',
        value: PriceRange.BPS_12000,
        onClick: () => {
          setPriceRange(
            new Fraction({ numerator: 83, denominator: 100 }),
            new Fraction({ numerator: 120, denominator: 100 }),
          )
        },
        description:
          'While maintaining the 50:50 token deposit ratio, this sets the minimum range to 0.833 * Current Price and the maximum range to 1.2 * Current Price.',
      },
      {
        label: '0.99× 1.01×',
        value: PriceRange.BPS_10100,
        onClick: () => {
          setPriceRange(
            new Fraction({ numerator: 99, denominator: 100 }),
            new Fraction({ numerator: 101, denominator: 100 }),
          )
        },
        description:
          'While maintaining the 50:50 token deposit ratio, this sets the minimum range to 0.990 * Current Price and the maximum range to 1.01 * Current Price.',
      },
      {
        label: 'Single Sided (Top)',
        value: PriceRange.RIGHT_SIDE,
        onClick: () => setSingleSided('right'),
        description:
          'This sets the price range to just above the current market price. Your position will not be earning fees until the current price moves upwards.',
      },
      {
        label: 'Single Sided (Bottom)',
        value: PriceRange.LEFT_SIDE,
        onClick: () => setSingleSided('left'),
        description:
          'This sets the price range to just below the current market price. Your position will not be earning fees until the current price moves downwards.',
      },
    ],
    [
      getSetFullRange,
      setPriceRange,
      setWeightLockedCurrencyBase,
      setSingleSided,
    ],
  )

  const isSorted = token0 && token1 && token0.wrap().sortsBefore(token1.wrap())
  const leftPrice = useMemo(
    () => (isSorted ? priceLower : priceUpper?.invert()),
    [isSorted, priceLower, priceUpper],
  )
  const rightPrice = useMemo(
    () => (isSorted ? priceUpper : priceLower?.invert()),
    [isSorted, priceLower, priceUpper],
  )

  const fiatAmounts = useMemo(() => {
    if (!token0 || !token1) return [undefined, undefined]

    const amount0 = Amount.tryFromHuman(token0, '1')
    const amount1 = Amount.tryFromHuman(token1, '1')
    return [amount0, amount1]
  }, [token0, token1])
  const fiatAmountsAsNumber = useTokenAmountDollarValues({
    chainId,
    amounts: fiatAmounts,
  })

  const { data: poolStats } = useConcentratedLiquidityPoolStats({
    chainId,
    address: poolAddress,
    enabled: Boolean(chainId && poolAddress),
  })

  const [valueRatio, capitalEfficiency, apr, sanitizedCE] = useMemo(() => {
    if (!price || !priceLower || !priceUpper) return [undefined, undefined]

    const capitalEfficiency = getCapitalEfficiency(
      price,
      priceLower,
      priceUpper,
    )
    const _ratio = getTokenRatio(price, priceLower, priceUpper)
    const ratio: [number, number] = invertPrice
      ? [_ratio[1], _ratio[0]]
      : _ratio

    const apr =
      (poolStats?.feeApr1d ?? 0) /
      (yieldRate === YieldRatePeriod.MONTHLY
        ? 12
        : yieldRate === YieldRatePeriod.DAILY
          ? 365
          : 1)

    // make sure capitial efficiency is valid
    const sanitizedCE =
      capitalEfficiency != null &&
      Number.isFinite(capitalEfficiency) &&
      capitalEfficiency > 0
        ? capitalEfficiency
        : undefined

    return [ratio, capitalEfficiency, apr, sanitizedCE]
  }, [price, priceLower, priceUpper, invertPrice, poolStats, yieldRate])

  const currentWeight0 = valueRatio?.[0]
  const handleToggleWeightLock = useCallback(() => {
    if (typeof weightLockedCurrencyBase !== 'number') {
      setWeightLockedCurrencyBase(currentWeight0)
    } else {
      if (typeof leftBoundInput === 'string') onLeftRangeInput(leftBoundInput)
      if (typeof rightBoundInput === 'string')
        onRightRangeInput(rightBoundInput)
      setWeightLockedCurrencyBase(undefined)
    }
  }, [
    leftBoundInput,
    rightBoundInput,
    onLeftRangeInput,
    onRightRangeInput,
    currentWeight0,
    weightLockedCurrencyBase,
    setWeightLockedCurrencyBase,
  ])

  const isTokenWeightUnmatched = useMemo(() => {
    if (
      typeof weightLockedCurrencyBase !== 'number' ||
      typeof currentWeight0 !== 'number'
    )
      return false
    const absDiff = Math.abs(currentWeight0 - weightLockedCurrencyBase)
    const pctDiff = Math.abs(currentWeight0 / weightLockedCurrencyBase - 1)
    return absDiff > 0.01 && pctDiff > 0.03 // threshold: 1% abs diff and 3% pct diff
  }, [weightLockedCurrencyBase, currentWeight0])

  const tokenToggle = useMemo(
    () =>
      switchTokens ? (
        <div className="flex items-center flex-wrap justify-between gap-2 w-full">
          <div className="hidden md:flex whitespace-nowrap font-medium text-sm">
            <div>Current Price </div>
            {isLoading || !pool || !token0 || !token1 ? (
              <SkeletonText fontSize="xs" />
            ) : (
              <div
                onClick={() => setInvert((prev) => !prev)}
                onKeyDown={() => setInvert((prev) => !prev)}
                className="cursor-pointer flex items-center gap-1.5"
              >
                <div className="flex items-baseline gap-1.5">
                  : 1 {invert ? token1.symbol : token0.symbol} ={' '}
                  {pool
                    .priceOf(invert ? token1.wrap() : token0.wrap())
                    ?.toSignificant(4)}{' '}
                  {invert ? token0.symbol : token1.symbol}
                  <span>
                    (${fiatAmountsAsNumber[invert ? 1 : 0].toFixed(2)})
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-1 w-full">
            <Toggle
              variant="outline"
              onClick={handleSwitchTokens}
              pressed={isSorted}
              size="xs"
              className="!w-full md:!w-fit"
            >
              {isSorted ? token0?.symbol : token1?.symbol}
            </Toggle>
            <Toggle
              variant="outline"
              onClick={handleSwitchTokens}
              pressed={!isSorted}
              size="xs"
              className="!w-full md:!w-fit"
            >
              {isSorted ? token1?.symbol : token0?.symbol}
            </Toggle>
          </div>
        </div>
      ) : undefined,
    [
      switchTokens,
      handleSwitchTokens,
      isSorted,
      token0,
      token1,
      fiatAmountsAsNumber,
      invert,
      isLoading,
      pool,
    ],
  )

  return (
    <div
      className={classNames(
        'flex flex-col gap-2',
        !token0 || !token1 ? 'opacity-40' : '',
      )}
    >
      <div className="flex flex-col gap-1">
        <p className="font-medium text-slate-900 dark:text-pink-100 text-base">
          Select Price Range
        </p>
        <p className="text-sm dark:text-pink-200 text-muted-foreground hidden md:block mb-2">
          Focus liquidity in a specific range to increase efficiency and fees,
          but it requires active monitoring. Or, use a full range to stay active
          across all prices for simplicity, but risk higher impermanent loss.
        </p>
      </div>

      <div className="rounded-xl flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-800">
        {isMounted && showStartPrice && token0 && token1 && (
          <div className="flex flex-col gap-3">
            {!noLiquidity && (
              <LiquidityChartRangeInput
                chainId={chainId}
                currencyA={token0}
                currencyB={token1}
                feeAmount={feeAmount}
                ticksAtLimit={ticksAtLimit}
                price={
                  price
                    ? Number.parseFloat(
                        (invertPrice ? price.invert() : price).toSignificant(8),
                      )
                    : undefined
                }
                priceLower={priceLower}
                priceUpper={priceUpper}
                weightLockedCurrencyBase={weightLockedCurrencyBase}
                onLeftRangeInput={(input) => {
                  setPriceRangeSelector(undefined)
                  onLeftRangeInput(input)
                }}
                onRightRangeInput={(input) => {
                  setPriceRangeSelector(undefined)
                  onRightRangeInput(input)
                }}
                interactive={!hasExistingPosition}
                tokenToggle={tokenToggle}
              />
            )}
          </div>
        )}
        <div className="flex flex-col gap-3">
          <RadioGroup value={priceRange} className="gap-2 flex flex-wrap">
            {PRICE_RANGE_OPTIONS.map(
              ({ value, label, description, onClick }) => (
                <RadioGroup.Option value={value} key={value}>
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Toggle
                          disabled={!feeAmount}
                          size="sm"
                          variant="outline"
                          className={classNames(
                            'whitespace-nowrap',
                            priceRange === value && '!bg-accent',
                          )}
                          onClick={
                            priceRange === value
                              ? () => {
                                  setPriceRangeSelector(undefined)
                                  resetMintState()
                                }
                              : () => {
                                  setPriceRangeSelector(value)
                                  onClick()
                                }
                          }
                          pressed={priceRange === value}
                        >
                          {label}
                        </Toggle>
                      </TooltipTrigger>

                      <TooltipContent className="bg-background !p-4 shadow-xl max-w-[20rem] !backdrop-blur-[40px]">
                        {description}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </RadioGroup.Option>
              ),
            )}
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    className={classNames(
                      typeof weightLockedCurrencyBase === 'number'
                        ? '!bg-accent'
                        : '!bg-transparent dark:!bg-transparent',
                    )}
                    variant={'outline'}
                    onClick={handleToggleWeightLock}
                  >
                    {typeof weightLockedCurrencyBase !== 'number' ? (
                      <LockOpenIcon width={10} height={10} />
                    ) : (
                      <LockClosedIcon width={10} height={10} />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-background !p-4 shadow-xl max-w-[20rem] !backdrop-blur-[40px]">
                  Lock the token ratio such that your price range automatically
                  adjusts when changing price boundary.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </RadioGroup>
          <div>
            {!noLiquidity && (
              <SliderPriceInput
                id="slider-price-input"
                value={[
                  ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]
                    ? 0
                    : Number.parseFloat(leftPrice?.toSignificant(5) ?? '0'),
                  ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]
                    ? Number.POSITIVE_INFINITY
                    : Number.parseFloat(rightPrice?.toSignificant(5) ?? '0'),
                ]}
                onUserInput={(val: number[]) => {
                  if (ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]) return
                  if (priceRange) return
                  const [lower, upper] = val
                  onLeftRangeInput(lower.toString())
                  onRightRangeInput(upper.toString())
                }}
                price={
                  price
                    ? Number.parseFloat(
                        (invertPrice ? price.invert() : price).toSignificant(8),
                      )
                    : undefined
                }
              />
            )}
          </div>
          {noLiquidity && (
            <div>
              <ConcentratedInitialPrice
                token0={token0!}
                token1={token1!}
                onStartPriceInput={onStartPriceInput}
                startingPrice={startPriceTypedValue}
              />
            </div>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <PriceBlock
              id={'min-price'}
              token0={token0}
              token1={token1}
              label="Min Price"
              value={
                ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]
                  ? '0'
                  : (leftPrice?.toSignificant(5) ?? '')
              }
              onUserInput={(input) => {
                setIndependentRangeField(Bound.LOWER)
                setPriceRangeSelector(undefined)
                onLeftRangeInput(input)
              }}
              decrement={isSorted ? getDecrementLower : getIncrementUpper}
              increment={isSorted ? getIncrementLower : getDecrementUpper}
              decrementDisabled={
                ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]
              }
              incrementDisabled={
                ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]
              }
              price={price}
            />
            <PriceBlock
              id={'max-price'}
              token0={token0}
              token1={token1}
              label="Max Price"
              value={
                ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]
                  ? '∞'
                  : (rightPrice?.toSignificant(5) ?? '')
              }
              onUserInput={(input) => {
                setIndependentRangeField(Bound.UPPER)
                setPriceRangeSelector(undefined)
                onRightRangeInput(input)
              }}
              decrement={isSorted ? getDecrementUpper : getIncrementLower}
              increment={isSorted ? getIncrementUpper : getDecrementLower}
              incrementDisabled={
                ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]
              }
              decrementDisabled={
                ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]
              }
              price={price}
            />
          </div>
          {outOfRange ? (
            <Message size="sm" variant="info">
              <div className="flex items-center gap-1">
                <InformationCircleIcon className="w-4 h-4 shrink-0" />
                Your position will not earn fees or be used in trades until the
                market price moves into your range.
              </div>
            </Message>
          ) : null}
          {invalidRange ? (
            <Message size="sm" variant="info">
              <div className="flex items-center gap-1">
                <InformationCircleIcon className="w-4 h-4 shrink-0" />
                Invalid range selected. The minimum price must be lower than the
                maximum price.
              </div>
            </Message>
          ) : null}
          <Card className="dark:bg-slate-800">
            <CardHeader>
              <CardDescription className="flex flex-col gap-3 !text-accent-foreground">
                <div className="flex flex-wrap items-start justify-between gap-1 flex-col sm:flex-row sm:items-center">
                  <span>
                    <span className="mr-1">{`Token Ratio (${token0?.symbol} : ${token1?.symbol})`}</span>
                    <Explainer iconProps={{ className: 'inline mb-0.5' }}>
                      This is the ratio of the cash values of the two underlying
                      tokens in this position.
                    </Explainer>
                  </span>
                  <div className="flex flex-grow gap-1 items-center justify-end">
                    {valueRatio
                      ? `${(valueRatio[0] * 100).toFixed(0)}% : ${(valueRatio[1] * 100).toFixed(0)}%`
                      : '-'}
                    {typeof weightLockedCurrencyBase === 'number' &&
                    isTokenWeightUnmatched ? (
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <ExclamationTriangleIcon
                              width={24}
                              height={24}
                              className="dark:text-yellow text-amber-900 p-0.5"
                            />
                          </TooltipTrigger>
                          <TooltipContent className="w-80">
                            {`We failed to adjust the price range to your wanted
                            token ratio (${(weightLockedCurrencyBase * 100).toFixed(0)}%:
                            ${((1 - weightLockedCurrencyBase) * 100).toFixed(0)}%
                            ). Maybe because the price range
                            is too narrow or too wide.`}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : null}
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Button
                            size="xs"
                            variant={
                              typeof weightLockedCurrencyBase !== 'number'
                                ? 'outline'
                                : 'destructive'
                            }
                            onClick={handleToggleWeightLock}
                          >
                            {typeof weightLockedCurrencyBase !== 'number' ? (
                              <LockOpenIcon width={10} height={10} />
                            ) : (
                              <LockClosedIcon width={10} height={10} />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="w-80">
                          Lock the token ratio such that your price range
                          automatically adjusts when changing price boundary.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                {noLiquidity ? null : (
                  <div className="flex flex-wrap items-start justify-between gap-1 flex-col sm:flex-row sm:items-center">
                    <span>
                      <span className="mr-1">Capital Efficiency</span>
                      <Explainer iconProps={{ className: 'inline mb-0.5' }}>
                        For example, 2x capital efficiency means one unit of
                        liquidity in a concentrated liquidity position would
                        require a 2x capital in a full range position.
                        <br />
                        <br />
                        The narrower the price range, the higher the capital
                        efficiency.
                      </Explainer>
                    </span>
                    <div className="flex flex-grow items-center justify-end">
                      {capitalEfficiency &&
                      Number.isFinite(capitalEfficiency) &&
                      capitalEfficiency >= 0 ? (
                        <>{capitalEfficiency.toFixed(2)}x</>
                      ) : (
                        '-'
                      )}
                    </div>
                  </div>
                )}
                {noLiquidity ? null : (
                  <div className="flex flex-wrap items-start justify-between gap-1 flex-col  sm:flex-row sm:items-center">
                    <span>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <span className="mr-1">
                              <span className="underline decoration-dotted">
                                {yieldRate === YieldRatePeriod.DAILY
                                  ? 'Daily Rate'
                                  : yieldRate === YieldRatePeriod.MONTHLY
                                    ? 'Monthly Rate'
                                    : 'APR'}
                              </span>{' '}
                              (when in-range, excl. IL)
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="!bg-secondary !p-0.5 !backdrop-blur-[40px]">
                            <RadioGroup
                              value={yieldRate}
                              onChange={setYieldRate}
                            >
                              <div className="flex gap-1 items-center">
                                {YIELD_RATE_OPTIONS.map(({ value, label }) => (
                                  <RadioGroup.Option
                                    value={value}
                                    key={value}
                                    as={Toggle}
                                    size="sm"
                                    pressed={yieldRate === value}
                                  >
                                    {label}
                                  </RadioGroup.Option>
                                ))}
                              </div>
                            </RadioGroup>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Explainer iconProps={{ className: 'inline mb-0.5' }}>
                        Estimated returns based on yesterday 24hr trade fees.
                        <br />
                        <br />
                        This value does not include the risk of divergence loss
                        (IL), and assumes the position is “in-range” all the
                        time.
                      </Explainer>
                    </span>
                    <div className="flex flex-grow items-center justify-end">
                      {!apr || !sanitizedCE ? (
                        <span className="text-muted-foreground">
                          Not enough data
                        </span>
                      ) : (
                        <span>
                          <span className="text-muted-foreground">
                            {formatPercent(apr)} * {sanitizedCE.toFixed(2)} =
                          </span>{' '}
                          {formatPercent(apr * sanitizedCE)}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
