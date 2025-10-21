'use client'

import {
  MinusIcon,
  PlusIcon,
  SwitchHorizontalIcon,
} from '@heroicons/react-v1/solid'
import { useIsMounted } from '@sushiswap/hooks'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Explainer,
  FormSection,
  Label,
  LinkExternal,
  Message,
  TextField,
  TextFieldDescription,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  classNames,
} from '@sushiswap/ui'
import { SkeletonText } from '@sushiswap/ui'
import { Toggle } from '@sushiswap/ui'
import React, {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Bound, Field } from 'src/lib/constants'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
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

import { Radio, RadioGroup } from '@headlessui/react'
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { useConcentratedLiquidityPoolStats } from 'src/lib/hooks/react-query'
import { useConcentratedLiquidityPositionsFromTokenId } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionsFromTokenId'
import { Amount, Fraction, formatPercent } from 'sushi'
import { useAccount } from 'wagmi'
import { LiquidityChartRangeInput } from './LiquidityChartRangeInput'
import {
  useConcentratedDerivedMintInfo,
  useConcentratedMintActionHandlers,
  useConcentratedMintState,
  useRangeHopCallbacks,
} from './concentrated-liquidity-provider'

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

interface SelectPricesWidget {
  chainId: SushiSwapV3ChainId
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  poolAddress: EvmAddress | undefined
  feeAmount: SushiSwapV3FeeAmount | undefined
  switchTokens?(): void
  tokenId: string | undefined
  children?: ReactNode
  showStartPrice?: boolean
}

export const SelectPricesWidget: FC<SelectPricesWidget> = ({
  chainId,
  token0,
  token1,
  poolAddress,
  feeAmount,
  switchTokens,
  tokenId,
  children,
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
    rightBoundInput,
    parsedAmounts,
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
    (multiplier: Fraction) => {
      if (!price) return
      const newPriceLower = price.asFraction.mul(price.scalar).div(multiplier)
      const newPriceUpper = price.asFraction.mul(price.scalar).mul(multiplier)
      setWeightLockedCurrencyBase(undefined)
      if (invertPrice) {
        onLeftRangeInput(newPriceUpper.invert().toString({ fixed: 6 }))
        onRightRangeInput(newPriceLower.invert().toString({ fixed: 6 }))
      } else {
        onLeftRangeInput(newPriceLower.toString({ fixed: 6 }))
        onRightRangeInput(newPriceUpper.toString({ fixed: 6 }))
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
      },
      {
        label: '×÷2',
        value: PriceRange.BPS_20000,
        onClick: () =>
          setPriceRange(new Fraction({ numerator: 20000, denominator: 10000 })),
      },
      {
        label: '×÷1.2',
        value: PriceRange.BPS_12000,
        onClick: () =>
          setPriceRange(new Fraction({ numerator: 12000, denominator: 10000 })),
      },
      {
        label: '×÷1.01',
        value: PriceRange.BPS_10100,
        onClick: () =>
          setPriceRange(new Fraction({ numerator: 10100, denominator: 10000 })),
      },
      {
        label: 'Single Sided (Left)',
        value: PriceRange.LEFT_SIDE,
        onClick: () => setSingleSided('left'),
      },
      {
        label: 'Single Sided (Right)',
        value: PriceRange.RIGHT_SIDE,
        onClick: () => setSingleSided('right'),
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

  const fiatAmounts = useMemo(
    () =>
      token0 && token1
        ? [Amount.fromHuman(token0, '1'), Amount.fromHuman(token1, '1')]
        : [],
    [token0, token1],
  )
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

  const poolFish = new URL('https://poolfish.xyz/calculators/sushi')
  poolFish.searchParams.append('network', `${chainId}`)
  if (token0) poolFish.searchParams.append('token0', token0.wrap().address)
  if (token1) poolFish.searchParams.append('token1', token1.wrap().address)
  if (feeAmount) poolFish.searchParams.append('feeTier', `${feeAmount}`)

  const tokenToggle = useMemo(
    () =>
      switchTokens ? (
        <div className="flex gap-1">
          <Toggle
            variant="outline"
            onPressedChange={handleSwitchTokens}
            pressed={isSorted}
            size="sm"
          >
            {isSorted ? token0?.symbol : token1?.symbol}
          </Toggle>
          <Toggle
            variant="outline"
            onPressedChange={handleSwitchTokens}
            pressed={!isSorted}
            size="sm"
          >
            {isSorted ? token1?.symbol : token0?.symbol}
          </Toggle>
        </div>
      ) : // <div />
      undefined,
    [switchTokens, handleSwitchTokens, isSorted, token0, token1],
  )

  return (
    <FormSection
      title="Range"
      description={
        <>
          Select a price range to provide liquidity. You will not earn any fees
          when prices move outside of this range.{' '}
          <a
            target="_blank"
            className="text-blue"
            rel="noopener noreferrer"
            href="https://docs.uniswap.org/concepts/protocol/concentrated-liquidity"
          >
            Learn more.
          </a>
        </>
      }
    >
      <div
        className={classNames(
          'flex flex-col gap-6',
          !token0 || !token1 ? 'opacity-40' : '',
        )}
      >
        {noLiquidity ? (
          <div className="flex flex-col gap-2">
            {tokenToggle}
            <Message size="sm" variant="muted" className="text-center">
              This pool must be initialized before you can add liquidity.{' '}
              {showStartPrice
                ? 'To initialize, select a starting price for the pool. Then, enter your liquidity price range and deposit amount. '
                : ''}
              Gas fees will be higher than usual due to the initialization
              transaction.
            </Message>
          </div>
        ) : null}
        {children ? children : null}
        <div className="rounded-xl flex flex-col gap-8">
          {isMounted && showStartPrice && (
            <div className="flex flex-col gap-3">
              {noLiquidity && (
                <div className="flex flex-col gap-2">
                  <Label>Start price</Label>
                  <TextField
                    variant="outline"
                    value={startPriceTypedValue}
                    onValueChange={onStartPriceInput}
                    testdata-id="start-price-input"
                    type="number"
                    unit={`${token1?.symbol} per ${token0?.symbol}`}
                  />
                  <TextFieldDescription>
                    Your pool needs a starting price somewhere between the min.
                    and max. price
                  </TextFieldDescription>
                </div>
              )}
              {!noLiquidity && (
                <LiquidityChartRangeInput
                  chainId={chainId}
                  currencyA={token0}
                  currencyB={token1}
                  feeAmount={feeAmount}
                  ticksAtLimit={ticksAtLimit}
                  priceRange={priceRange}
                  price={
                    price
                      ? Number.parseFloat(
                          (invertPrice ? price.invert() : price).toSignificant(
                            8,
                          ),
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
            <div className="flex lg:hidden">
              {isLoading || !pool || !token0 || !token1 ? (
                <SkeletonText fontSize="xs" />
              ) : (
                <div
                  onClick={() => setInvert((prev) => !prev)}
                  onKeyDown={() => setInvert((prev) => !prev)}
                  className="text-xs flex items-center font-semibold gap-1.5 rounded-xl text-blue hover:text-blue-600"
                >
                  <SwitchHorizontalIcon width={16} height={16} />
                  <div className="flex items-baseline gap-1.5">
                    {invert ? token1.symbol : token0.symbol} ={' '}
                    {pool
                      .priceOf(invert ? token1.wrap() : token0.wrap())
                      ?.toSignificant(4)}{' '}
                    {invert ? token0.symbol : token1.symbol}
                    <span className="text-xs font-normal">
                      ${fiatAmountsAsNumber[invert ? 1 : 0].toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-4 justify-between">
              <RadioGroup
                value={priceRange || ''}
                className="gap-2 flex flex-wrap"
              >
                {PRICE_RANGE_OPTIONS.map(({ value, label, onClick }) => (
                  <Radio value={value} key={value}>
                    <Toggle
                      disabled={!feeAmount}
                      size="sm"
                      variant="outline"
                      className="whitespace-nowrap"
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
                  </Radio>
                ))}
              </RadioGroup>
            </div>
            <Card>
              <CardHeader>
                <CardDescription className="flex flex-col gap-3 !text-accent-foreground">
                  <div className="flex flex-wrap items-start justify-between gap-1 flex-col sm:flex-row sm:items-center">
                    <span>
                      <span className="mr-1">{`Token Ratio (${token0?.symbol} : ${token1?.symbol})`}</span>
                      <Explainer iconProps={{ className: 'inline mb-0.5' }}>
                        This is the ratio of the cash values of the two
                        underlying tokens in this position.
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
                          <TooltipContent className="!bg-secondary !p-0.5">
                            <RadioGroup
                              value={yieldRate}
                              onChange={setYieldRate}
                            >
                              <div className="flex gap-1 items-center">
                                {YIELD_RATE_OPTIONS.map(({ value, label }) => (
                                  <Radio
                                    value={value}
                                    key={value}
                                    as={Toggle}
                                    size="sm"
                                    pressed={yieldRate === value}
                                  >
                                    {label}
                                  </Radio>
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
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
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
            />
          </div>
          <Card>
            <CardHeader>
              <CardDescription>
                We{`'`}re excited to share that Sushi integration is now live on{' '}
                <LinkExternal href="https://poolfish.xyz/calculators/sushi">
                  Poolfish.xyz
                </LinkExternal>
                ! To get an estimate of the fees you could earn based on your
                chosen parameters, please visit our platform by clicking here.
                We look forward to assisting you with your earnings
                calculations.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <LinkExternal href={poolFish.toString()}>
                <Button variant="link" size="sm" asChild>
                  View position on Poolfish.xyz
                </Button>
              </LinkExternal>
            </CardFooter>
          </Card>
        </div>
      </div>
    </FormSection>
  )
}

interface PriceBlockProps {
  id?: string
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  label: string
  value: string
  decrement(): string
  increment(): string
  onUserInput(val: string): void
  decrementDisabled?: boolean
  incrementDisabled?: boolean
  locked?: boolean
  focus?: boolean
}

export const PriceBlock: FC<PriceBlockProps> = ({
  id,
  locked,
  onUserInput,
  decrement,
  increment,
  decrementDisabled,
  incrementDisabled,
  token0,
  token1,
  label,
  value,
  focus = false,
}) => {
  const [localValue, setLocalValue] = useState('')
  const [useLocalValue, setUseLocalValue] = useState(false)

  const handleOnFocus = () => {
    setUseLocalValue(true)
  }

  const handleOnBlur = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(localValue)
  }, [localValue, onUserInput])

  const handleDecrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(decrement())
  }, [decrement, onUserInput])

  const handleIncrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(increment())
  }, [increment, onUserInput])

  useEffect(() => {
    if (localValue !== value && !useLocalValue) {
      setTimeout(() => {
        setLocalValue(value)
      }, 0)
    }
  }, [localValue, useLocalValue, value])

  return (
    <Card
      className="bg-transparent shadow-none"
      onBlur={handleOnBlur}
      onFocus={handleOnFocus}
    >
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>
          {token1?.symbol} per {token0?.symbol}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <TextField
            autoFocus={focus}
            variant="naked"
            testdata-id={`${id}-input`}
            type="number"
            value={localValue}
            onValueChange={setLocalValue}
            disabled={locked}
            tabIndex={0}
            className="text-3xl font-medium pt-1 pb-2"
          />
          <div className="flex gap-1">
            <button
              type="button"
              disabled={decrementDisabled}
              onClick={handleDecrement}
              className={classNames(
                decrementDisabled
                  ? 'opacity-40'
                  : 'hover:bg-gray-300 dark:hover:bg-slate-600',
                'flex items-center justify-center w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded-full',
              )}
              tabIndex={-1}
            >
              <MinusIcon width={12} height={12} />
            </button>
            <button
              type="button"
              disabled={incrementDisabled}
              onClick={handleIncrement}
              onKeyDown={handleIncrement}
              className={classNames(
                incrementDisabled
                  ? 'opacity-40'
                  : 'hover:bg-gray-300 dark:hover:bg-slate-600',
                'flex items-center justify-center w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded-full',
              )}
              tabIndex={-1}
            >
              <PlusIcon width={12} height={12} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
