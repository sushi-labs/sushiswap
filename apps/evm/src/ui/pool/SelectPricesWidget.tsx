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
import { SkeletonText } from '@sushiswap/ui/components/skeleton'
import { Toggle } from '@sushiswap/ui/components/toggle'
import {
  FeeAmount,
  SushiSwapV3ChainId,
  getCapitalEfficiency,
  getTokenRatio,
} from '@sushiswap/v3-sdk'
import { useAccount } from '@sushiswap/wagmi'
import { useConcentratedLiquidityPositionsFromTokenId } from '@sushiswap/wagmi'
import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Bound, Field } from 'src/lib/constants'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { Type, tryParseAmount } from 'sushi/currency'

import { RadioGroup } from '@headlessui/react'
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { useConcentratedLiquidityPoolStats } from '@sushiswap/react-query'
import { formatPercent } from 'sushi/format'
import { Fraction } from 'sushi/math'
import {
  useConcentratedDerivedMintInfo,
  useConcentratedMintActionHandlers,
  useConcentratedMintState,
  useRangeHopCallbacks,
} from './ConcentratedLiquidityProvider'
import LiquidityChartRangeInput from './LiquidityChartRangeInput'

enum PriceRange {
  FULL_RANGE = 0,
  BPS_20000 = 1,
  BPS_12000 = 2,
  BPS_10100 = 3,
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
  token0: Type | undefined
  token1: Type | undefined
  poolAddress: string | undefined
  feeAmount: FeeAmount | undefined
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
      const newPriceLower = price.asFraction
        .multiply(price.scalar)
        .divide(multiplier)
      const newPriceUpper = price.asFraction
        .multiply(price.scalar)
        .multiply(multiplier)
      setWeightLockedCurrencyBase(undefined)
      if (invertPrice) {
        onLeftRangeInput(newPriceUpper.invert().toFixed(6))
        onRightRangeInput(newPriceLower.invert().toFixed(6))
      } else {
        onLeftRangeInput(newPriceLower.toFixed(6))
        onRightRangeInput(newPriceUpper.toFixed(6))
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

  const formattedAmounts: {
    [_formattedAmountsField in Field]: string
  } = useMemo(
    () => ({
      [Field.CURRENCY_A]:
        independentField === Field.CURRENCY_A
          ? typedValue
          : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
      [Field.CURRENCY_B]:
        independentField === Field.CURRENCY_A
          ? parsedAmounts[dependentField]?.toSignificant(6) ?? ''
          : typedValue,
    }),
    [typedValue, dependentField, independentField, parsedAmounts],
  )

  const handleSwitchTokens = () => {
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
  }

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
        onClick: () => setPriceRange(new Fraction(20000, 10000)),
      },
      {
        label: '×÷1.2',
        value: PriceRange.BPS_12000,
        onClick: () => setPriceRange(new Fraction(12000, 10000)),
      },
      {
        label: '×÷1.01',
        value: PriceRange.BPS_10100,
        onClick: () => setPriceRange(new Fraction(10100, 10000)),
      },
    ],
    [getSetFullRange, setPriceRange, setWeightLockedCurrencyBase],
  )

  const isSorted =
    token0 && token1 && token0.wrapped.sortsBefore(token1.wrapped)
  const leftPrice = useMemo(
    () => (isSorted ? priceLower : priceUpper?.invert()),
    [isSorted, priceLower, priceUpper],
  )
  const rightPrice = useMemo(
    () => (isSorted ? priceUpper : priceLower?.invert()),
    [isSorted, priceLower, priceUpper],
  )

  const fiatAmounts = useMemo(
    () => [tryParseAmount('1', token0), tryParseAmount('1', token1)],
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
      ((poolStats?.feeApr1d ?? 0) + (poolStats?.incentiveApr ?? 0)) /
      100 /
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
  if (token0) poolFish.searchParams.append('token0', token0.wrapped.address)
  if (token1) poolFish.searchParams.append('token1', token1.wrapped.address)
  if (feeAmount) poolFish.searchParams.append('feeTier', `${feeAmount}`)

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
          <Message size="sm" variant="muted" className="text-center">
            This pool must be initialized before you can add liquidity.{' '}
            {showStartPrice
              ? 'To initialize, select a starting price for the pool. Then, enter your liquidity price range and deposit amount. '
              : ''}
            Gas fees will be higher than usual due to the initialization
            transaction.
          </Message>
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
                <>
                  <LiquidityChartRangeInput
                    chainId={chainId}
                    currencyA={token0}
                    currencyB={token1}
                    feeAmount={feeAmount}
                    ticksAtLimit={ticksAtLimit}
                    priceRange={priceRange}
                    price={
                      price
                        ? parseFloat(
                            (invertPrice
                              ? price.invert()
                              : price
                            ).toSignificant(8),
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
                  />
                </>
              )}
            </div>
          )}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex justify-end lg:hidden">
                {isLoading || !pool || !token0 || !token1 ? (
                  <SkeletonText fontSize="xs" />
                ) : (
                  <div
                    onClick={() => setInvert((prev) => !prev)}
                    onKeyDown={() => setInvert((prev) => !prev)}
                    role="button"
                    className="text-xs flex items-center font-semibold gap-1.5 rounded-xl text-blue hover:text-blue-600"
                  >
                    <SwitchHorizontalIcon width={16} height={16} />
                    <div className="flex items-baseline gap-1.5">
                      {invert ? token1.symbol : token0.symbol} ={' '}
                      {pool
                        .priceOf(invert ? token1.wrapped : token0.wrapped)
                        ?.toSignificant(4)}{' '}
                      {invert ? token0.symbol : token1.symbol}
                      <span className="text-xs font-normal">
                        ${fiatAmountsAsNumber[invert ? 1 : 0].toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-1 justify-between">
                <RadioGroup value={priceRange} className="gap-2 flex">
                  {PRICE_RANGE_OPTIONS.map(({ value, label, onClick }) => (
                    <RadioGroup.Option value={value} key={value}>
                      <Toggle
                        disabled={!feeAmount}
                        size="sm"
                        variant="outline"
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
                    </RadioGroup.Option>
                  ))}
                </RadioGroup>
                {switchTokens ? (
                  <div className="flex justify-end gap-1">
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
                ) : (
                  <div />
                )}
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardDescription className="flex flex-col gap-3 !text-accent-foreground">
                  <div className="flex justify-between">
                    <div className="flex gap-1 items-center">
                      {`Token Ratio (${token0?.symbol} : ${token1?.symbol})`}
                      <Explainer>
                        This is the ratio of the cash values of the two
                        underlying tokens in this position.
                      </Explainer>
                    </div>
                    <div className="flex gap-1 items-center">
                      {valueRatio
                        ? `${(valueRatio[0] * 100).toFixed(0)}% : ${(
                            valueRatio[1] * 100
                          ).toFixed(0)}%`
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
                            token ratio (${(
                              weightLockedCurrencyBase * 100
                            ).toFixed(0)}%:
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
                  <div className="flex justify-between">
                    <div className="flex gap-1 items-center">
                      Capital Efficiency
                      <Explainer>
                        For example, 2x capital efficiency means one unit of
                        liquidity in a concentrated liquidity position would
                        require a 2x capital in a full range position.
                        <br />
                        <br />
                        The narrower the price range, the higher the capital
                        efficiency.
                      </Explainer>
                    </div>
                    <div>
                      {capitalEfficiency &&
                      Number.isFinite(capitalEfficiency) &&
                      capitalEfficiency >= 0 ? (
                        <>{capitalEfficiency.toFixed(2)}x</>
                      ) : (
                        '-'
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between ">
                    <div className="flex gap-1 items-center">
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <span>
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
                      <Explainer>
                        Estimated returns based on yesterday 24hr trade fees.
                        <br />
                        <br />
                        This value does not include the risk of divergence loss
                        (IL), and assumes the position is “in-range” all the
                        time.
                      </Explainer>
                    </div>
                    {!apr || !sanitizedCE ? (
                      <div className="text-muted-foreground">
                        Not enough data
                      </div>
                    ) : (
                      <div>
                        <span className="text-muted-foreground">
                          {formatPercent(apr)} * {sanitizedCE.toFixed(2)} =
                        </span>{' '}
                        {formatPercent(apr * sanitizedCE)}
                      </div>
                    )}
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="flex gap-2">
            <PriceBlock
              id={'min-price'}
              token0={token0}
              token1={token1}
              label="Min Price"
              value={
                ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]
                  ? '0'
                  : leftPrice?.toSignificant(5) ?? ''
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
              focus={true}
            />
            <PriceBlock
              id={'max-price'}
              token0={token0}
              token1={token1}
              label="Max Price"
              value={
                ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]
                  ? '∞'
                  : rightPrice?.toSignificant(5) ?? ''
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
                <Button variant="link" size="sm">
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
  token0: Type | undefined
  token1: Type | undefined
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
  // let user type value and only update parent value on blur
  const [localValue, setLocalValue] = useState('')
  const [useLocalValue, setUseLocalValue] = useState(false)

  const handleOnFocus = () => {
    setUseLocalValue(true)
  }

  const handleOnBlur = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(localValue) // trigger update on parent value
  }, [localValue, onUserInput])

  // for button clicks
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
        setLocalValue(value) // reset local value to match parent
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
