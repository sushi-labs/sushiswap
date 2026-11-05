'use client'

import { SwitchHorizontalIcon } from '@heroicons/react-v1/solid'
import { useIsMounted } from '@sushiswap/hooks'
import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  Explainer,
  FormSection,
  LinkExternal,
  Message,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  classNames,
} from '@sushiswap/ui'
import { SkeletonText } from '@sushiswap/ui'
import { Toggle } from '@sushiswap/ui'
import { type FC, type ReactNode, useCallback, useMemo, useState } from 'react'
import { Bound, Field } from 'src/lib/constants'
import { useTokenAmountDollarValues } from 'src/lib/hooks/use-token-amount-dollar-values'
import { PRICE_RANGE_MULTIPLIERS, PriceRange } from 'src/lib/pool/cl'
import type {
  EvmAddress,
  EvmCurrency,
  SushiSwapV3ChainId,
  SushiSwapV3FeeAmount,
} from 'sushi/evm'

import { Radio, RadioGroup } from '@headlessui/react'
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { useConcentratedLiquidityPoolStats } from 'src/lib/hooks/react-query/pools/use-concentrated-liquidity-pool-stats'
import { useConcentratedLiquidityPositionsFromTokenId } from 'src/lib/wagmi/hooks/positions/hooks/use-concentrated-positions-from-token-id'
import { Amount, formatPercent } from 'sushi'
import { useConnection } from 'wagmi'
import {
  useConcentratedDerivedMintInfo,
  useConcentratedMintActionHandlers,
  useConcentratedMintState,
} from '../concentrated-liquidity-provider'
import {
  useRangeInput,
  useStartPriceInput,
} from '../concentrated-liquidity-provider/use-range-input'
import { LiquidityChartRangeInput } from '../liquidity-chart-range-input'
import {
  RangePresetToggles,
  RangePriceInputs,
  RangeStat,
  RangeTokenToggle,
  StartPriceInput,
  useRangeRatio,
} from './range-controls'

const PRICE_RANGE_OPTIONS = [
  { label: 'Full Range', value: PriceRange.FULL_RANGE },
  ...PRICE_RANGE_MULTIPLIERS,
  { label: 'Single Sided (Left)', value: PriceRange.LEFT_SIDE },
  { label: 'Single Sided (Right)', value: PriceRange.RIGHT_SIDE },
]

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
  const { address } = useConnection()
  const [invert, setInvert] = useState(false)
  const [yieldRate, setYieldRate] = useState<YieldRatePeriod>(
    YieldRatePeriod.ANNUALLY,
  )
  const {
    price,
    invertPrice,
    pricesAtTicks,
    ticks,
    ticksAtLimit,
    pool,
    poolForPosition,
    noLiquidity,
    isLoading,
    parsedAmounts,
    dependentField,
    currency0,
    currency1,
    tickSpacing,
  } = useConcentratedDerivedMintInfo({
    chainId,
    account: address,
    token0,
    token1,
    feeAmount,
    existingPosition: undefined,
  })

  const { onFieldAInput, onFieldBInput, resetMintState } =
    useConcentratedMintActionHandlers()
  const range = useRangeInput({
    currency0,
    currency1,
    invertPrice,
    tickSpacing,
    tickCurrent: poolForPosition?.tickCurrent,
    ticks,
  })
  const startPrice = useStartPriceInput({
    currency0,
    currency1,
    price,
    invertPrice,
  })
  // Of the displayed base, token0 (currencyA)
  const { lockedWeight } = range

  const { independentField, typedValue } = useConcentratedMintState()

  const { data: existingPosition, isLoading: positionLoading } =
    useConcentratedLiquidityPositionsFromTokenId({
      chainId,
      tokenId,
    })
  const hasExistingPosition = !!existingPosition && !positionLoading

  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

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

  // The range, start price and locked weight don't depend on which token is
  // base; the amounts are of a token, so they move with it
  const handleSwitchTokens = useCallback(() => {
    switchTokens?.()
    if (independentField === Field.CURRENCY_A) {
      onFieldBInput(formattedAmounts[Field.CURRENCY_A] ?? '')
    } else {
      onFieldAInput(formattedAmounts[Field.CURRENCY_B] ?? '')
    }
  }, [
    switchTokens,
    independentField,
    onFieldAInput,
    onFieldBInput,
    formattedAmounts,
  ])

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

  const { valueRatio, capitalEfficiency } = useRangeRatio(
    price,
    pricesAtTicks,
    invertPrice,
  )
  const apr =
    (poolStats?.feeApr1d ?? 0) /
    (yieldRate === YieldRatePeriod.MONTHLY
      ? 12
      : yieldRate === YieldRatePeriod.DAILY
        ? 365
        : 1)

  const currentWeight0 = valueRatio?.[0]
  const handleToggleWeightLock = useCallback(() => {
    if (typeof lockedWeight !== 'number') {
      range.setLockedWeight(currentWeight0)
    } else {
      // Keep the range the weight set, which unlocks it; a bound at the limit
      // stays one, whatever the tick spacing
      range.setRange(
        ticksAtLimit[Bound.LOWER] ? true : ticks[Bound.LOWER],
        ticksAtLimit[Bound.UPPER] ? true : ticks[Bound.UPPER],
      )
    }
  }, [range, ticks, ticksAtLimit, currentWeight0, lockedWeight])

  const isTokenWeightUnmatched = useMemo(() => {
    if (typeof lockedWeight !== 'number' || typeof currentWeight0 !== 'number')
      return false
    const absDiff = Math.abs(currentWeight0 - lockedWeight)
    const pctDiff = Math.abs(currentWeight0 / lockedWeight - 1)
    return absDiff > 0.01 && pctDiff > 0.03 // threshold: 1% abs diff and 3% pct diff
  }, [lockedWeight, currentWeight0])

  const poolFish = new URL('https://poolfish.xyz/calculators/sushi')
  poolFish.searchParams.append('network', `${chainId}`)
  if (token0) poolFish.searchParams.append('token0', token0.wrap().address)
  if (token1) poolFish.searchParams.append('token1', token1.wrap().address)
  if (feeAmount) poolFish.searchParams.append('feeTier', `${feeAmount}`)

  const tokenToggle = switchTokens ? (
    <RangeTokenToggle
      currencyA={token0}
      currencyB={token1}
      invertPrice={invertPrice}
      onSwitch={handleSwitchTokens}
    />
  ) : undefined

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
                <StartPriceInput
                  currencyA={token0}
                  currencyB={token1}
                  value={startPrice.value}
                  onChange={startPrice.onChange}
                />
              )}
              {!noLiquidity && (
                <LiquidityChartRangeInput
                  chainId={chainId}
                  currencyA={token0}
                  currencyB={token1}
                  feeAmount={feeAmount}
                  ticksAtLimit={ticksAtLimit}
                  priceRange={range.preset}
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
                  weightLockedCurrencyBase={lockedWeight}
                  onLeftRangeInput={range.setMinPrice}
                  onRightRangeInput={range.setMaxPrice}
                  isSorted={!invertPrice}
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
              <RangePresetToggles
                options={PRICE_RANGE_OPTIONS}
                range={range}
                onDeselect={resetMintState}
                disabled={!feeAmount}
              />
            </div>
            <Card>
              <CardHeader>
                <CardDescription className="flex flex-col gap-3 !text-accent-foreground">
                  <RangeStat
                    label={`Token Ratio (${token0?.symbol} : ${token1?.symbol})`}
                    explainer="This is the ratio of the cash values of the two underlying tokens in this position."
                  >
                    {valueRatio
                      ? `${(valueRatio[0] * 100).toFixed(0)}% : ${(
                          valueRatio[1] * 100
                        ).toFixed(0)}%`
                      : '-'}
                    {typeof lockedWeight === 'number' &&
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
                            token ratio (${(lockedWeight * 100).toFixed(0)}%:
                            ${((1 - lockedWeight) * 100).toFixed(0)}%
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
                              typeof lockedWeight !== 'number'
                                ? 'outline'
                                : 'destructive'
                            }
                            onClick={handleToggleWeightLock}
                          >
                            {typeof lockedWeight !== 'number' ? (
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
                  </RangeStat>
                  <RangeStat
                    label="Capital Efficiency"
                    explainer={
                      <>
                        For example, 2x capital efficiency means one unit of
                        liquidity in a concentrated liquidity position would
                        require a 2x capital in a full range position.
                        <br />
                        <br />
                        The narrower the price range, the higher the capital
                        efficiency.
                      </>
                    }
                  >
                    {capitalEfficiency
                      ? `${capitalEfficiency.toFixed(2)}x`
                      : '-'}
                  </RangeStat>
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
                      {!apr || !capitalEfficiency ? (
                        <span className="text-muted-foreground">
                          Not enough data
                        </span>
                      ) : (
                        <span>
                          <span className="text-muted-foreground">
                            {formatPercent(apr)} *{' '}
                            {capitalEfficiency.toFixed(2)} =
                          </span>{' '}
                          {formatPercent(apr * capitalEfficiency)}
                        </span>
                      )}
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          <RangePriceInputs
            currencyA={token0}
            currencyB={token1}
            pricesAtTicks={pricesAtTicks}
            ticksAtLimit={ticksAtLimit}
            invertPrice={invertPrice}
            range={range}
          />
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
