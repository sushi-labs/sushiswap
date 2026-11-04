'use client'

import {
  Button,
  FormSection,
  Label,
  Message,
  SkeletonText,
  TextFieldDescription,
  classNames,
} from '@sushiswap/ui'
import { type ComponentProps, type ReactElement, useState } from 'react'
import { SegmentedControl } from 'src/lib/components/segmented-control'
import { Bound, Field } from 'src/lib/constants'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { withoutScientificNotation } from 'sushi'
import { useCurrencyPrice } from '~evm/_common/ui/price-provider/price-provider/use-currency-price'
import {
  useConcentratedDerivedMintInfo,
  useConcentratedMintActionHandlers,
  useConcentratedMintState,
  useRangeHopCallbacks,
} from '../concentrated-liquidity-provider'
import type { SelectPricesWidget } from './index'
import { isUsableUsdPrice, toDisplayPrice, toPairPrice } from './price-units'
import { SimplePriceField } from './simple-price-field'
import { getSingleTokenRange } from './single-token-range'
import { UsdPriceExplainer } from './usd-price-explainer'

export function SimplePriceRange({
  chainId,
  token0,
  token1,
  feeAmount,
  children,
  showStartPrice = true,
}: ComponentProps<typeof SelectPricesWidget>): ReactElement {
  const address = useAccount('evm')
  const [inverted, setInverted] = useState(false)
  const [unit, setUnit] = useState<'usd' | 'pair'>('usd')
  const {
    startPriceTypedValue,
    weightLockedCurrencyBase,
    independentField,
    typedValue,
  } = useConcentratedMintState()
  const {
    onLeftRangeInput,
    onRightRangeInput,
    onStartPriceInput,
    onFieldAInput,
    onFieldBInput,
    setFullRange,
    setIndependentRangeField,
  } = useConcentratedMintActionHandlers()
  const info = useConcentratedDerivedMintInfo({
    chainId,
    account: address,
    token0,
    token1,
    baseToken: token0,
    feeAmount,
  })
  const {
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
  } = useRangeHopCallbacks(
    token0,
    token1,
    feeAmount,
    info.ticks.LOWER,
    info.ticks.UPPER,
    info.poolForPosition,
  )
  const base = inverted ? token1 : token0
  const quote = inverted ? token0 : token1
  const basePrice = useCurrencyPrice({ currency: base })
  const quotePrice = useCurrencyPrice({ currency: quote })
  const usdAvailable = !quotePrice.isError && isUsableUsdPrice(quotePrice.data)
  const useUsd = unit === 'usd' && usdAvailable
  const units = { inverted, usdPrice: useUsd ? quotePrice.data : undefined }
  const unitLabel = `${useUsd ? 'USD' : (quote?.symbol ?? 'Token')} per ${base?.symbol ?? 'token'}`
  const locked =
    !token0 ||
    !token1 ||
    !feeAmount ||
    info.isLoading ||
    typeof weightLockedCurrencyBase === 'number'

  const leftPrice = info.invertPrice
    ? info.pricesAtTicks.UPPER?.invert()
    : info.pricesAtTicks.LOWER
  const rightPrice = info.invertPrice
    ? info.pricesAtTicks.LOWER?.invert()
    : info.pricesAtTicks.UPPER
  const lowerTickBound =
    info.invertPrice !== inverted ? Bound.UPPER : Bound.LOWER
  const upperTickBound =
    lowerTickBound === Bound.LOWER ? Bound.UPPER : Bound.LOWER
  const canonicalLowerSteps = {
    decrement: info.invertPrice ? getIncrementUpper : getDecrementLower,
    increment: info.invertPrice ? getDecrementUpper : getIncrementLower,
  }
  const canonicalUpperSteps = {
    decrement: info.invertPrice ? getIncrementLower : getDecrementUpper,
    increment: info.invertPrice ? getDecrementLower : getIncrementUpper,
  }
  const lowerSteps = inverted
    ? {
        decrement: canonicalUpperSteps.increment,
        increment: canonicalUpperSteps.decrement,
      }
    : canonicalLowerSteps
  const upperSteps = inverted
    ? {
        decrement: canonicalLowerSteps.increment,
        increment: canonicalLowerSteps.decrement,
      }
    : canonicalUpperSteps
  const currentPairPrice =
    (info.invertPrice ? info.price?.invert() : info.price)?.toSignificant(18) ??
    ''
  const currentPrice = toDisplayPrice(currentPairPrice, units)
  const suggestedStart =
    !basePrice.isError && isUsableUsdPrice(basePrice.data) && usdAvailable
      ? toPairPrice(withoutScientificNotation(String(basePrice.data)) ?? '', {
          inverted,
          usdPrice: quotePrice.data,
        })
      : ''

  const singleTokenOptions = [
    {
      token: token0,
      field: Field.CURRENCY_A,
      selected: info.depositBDisabled && !info.depositADisabled,
    },
    {
      token: token1,
      field: Field.CURRENCY_B,
      selected: info.depositADisabled && !info.depositBDisabled,
    },
  ].map((option) => ({
    ...option,
    range: getSingleTokenRange({
      pool: info.poolForPosition,
      token0,
      token1,
      depositToken: option.token,
    }),
  }))
  const selectedSingleTokenOption = singleTokenOptions.find(
    (option) => option.selected,
  )
  const singleToken = selectedSingleTokenOption?.token
  const bothTokensSelected =
    !!info.poolForPosition &&
    typeof info.ticks.LOWER === 'number' &&
    typeof info.ticks.UPPER === 'number' &&
    !info.depositADisabled &&
    !info.depositBDisabled

  function selectBothTokens(): void {
    if (locked || !info.poolForPosition) return
    setFullRange()
  }

  function selectSingleToken(
    option: (typeof singleTokenOptions)[number],
  ): void {
    if (locked || !option.range) return
    setFullRange()
    setIndependentRangeField(option.range.bound)
    if (option.range.bound === Bound.LOWER) onLeftRangeInput(option.range.value)
    else onRightRangeInput(option.range.value)

    // Keep an amount only if it was entered for the same token. A numeric
    // amount from the other token must never be reinterpreted as this token.
    const amount = independentField === option.field ? typedValue : ''
    if (option.field === Field.CURRENCY_A)
      onFieldAInput(amount, info.noLiquidity)
    else onFieldBInput(amount, info.noLiquidity)
  }

  function selectDepositTokens(value: Field | 'both'): void {
    if (value === 'both') {
      if (!bothTokensSelected) selectBothTokens()
      return
    }
    const option = singleTokenOptions.find((option) => option.field === value)
    if (!option) return
    if (option.selected) selectBothTokens()
    else selectSingleToken(option)
  }

  function commitRange(bound: Bound, value: string): void {
    const canonicalBound = inverted
      ? bound === Bound.LOWER
        ? Bound.UPPER
        : Bound.LOWER
      : bound
    setIndependentRangeField(canonicalBound)
    if (canonicalBound === Bound.LOWER) onLeftRangeInput(value)
    else onRightRangeInput(value)
  }

  return (
    <FormSection
      title="Range"
      description="Select a price range to provide liquidity. You will not earn any fees when prices move outside of this range."
    >
      <div className="flex flex-col gap-6">
        {children}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs leading-5 text-muted-foreground">
              Price of
            </span>
            <SegmentedControl<'token0' | 'token1'>
              label="Price token"
              value={inverted ? 'token1' : 'token0'}
              onValueChange={(value) => setInverted(value === 'token1')}
              options={[
                {
                  value: 'token0',
                  label: token0?.symbol ?? 'Token 1',
                  disabled: !token0 || !token1,
                },
                {
                  value: 'token1',
                  label: token1?.symbol ?? 'Token 2',
                  disabled: !token0 || !token1,
                },
              ]}
            />
          </div>
          <div className="flex items-center gap-0.5">
            <div
              className={classNames(
                'transition-opacity duration-300',
                useUsd ? 'opacity-100 ' : 'opacity-0 invisible',
              )}
            >
              <UsdPriceExplainer quoteSymbol={quote?.symbol} />
            </div>
            <SegmentedControl<'usd' | 'pair'>
              label="Price units"
              value={useUsd ? 'usd' : 'pair'}
              onValueChange={setUnit}
              options={[
                {
                  value: 'usd',
                  label: 'USD',
                  disabled: !usdAvailable,
                  descriptionId: !usdAvailable
                    ? 'simple-usd-unavailable'
                    : undefined,
                },
                { value: 'pair', label: 'Token units' },
              ]}
            />
          </div>
        </div>
        {!usdAvailable && useUsd ? (
          <Message id="simple-usd-unavailable" size="sm" variant="muted">
            {quotePrice.isLoading ? (
              'Loading USD price. You can enter prices in token units.'
            ) : (
              <>
                {`USD value unavailable: no usable USD price for ${quote?.symbol ?? 'the paired token'}. `}
                <Button
                  size="sm"
                  variant="link"
                  onClick={() => setUnit('pair')}
                >
                  Switch to token units.
                </Button>
              </>
            )}
          </Message>
        ) : null}
        {typeof weightLockedCurrencyBase === 'number' && (
          <Message size="sm" variant="muted">
            The token ratio is locked. Switch to Advanced to unlock it before
            editing prices here.
          </Message>
        )}
        {info.noLiquidity && showStartPrice && (
          <div className="flex flex-col gap-2">
            <Message size="sm" variant="muted" className="text-center">
              This pool must be initialized before you can add liquidity. Select
              a starting price, then enter your range and deposit amount. Gas
              fees will be higher due to initialization.
            </Message>
            <SimplePriceField
              key={`start:${inverted}:${useUsd}`}
              id="simple-start-price"
              label="Start price"
              token0={base}
              token1={quote}
              unit={unitLabel}
              units={units}
              value={startPriceTypedValue}
              onCommit={onStartPriceInput}
              locked={locked}
            />
            <TextFieldDescription className="!text-xs leading-5">
              Enter the starting price of {base?.symbol ?? 'your token'}.{' '}
              {suggestedStart
                ? 'A market price is available as a suggestion.'
                : 'No market price is required if you set the starting price yourself.'}
            </TextFieldDescription>
            {suggestedStart && (
              <div>
                <Button
                  size="sm"
                  variant="link"
                  disabled={locked}
                  onClick={() => onStartPriceInput(suggestedStart)}
                >
                  Use market price
                </Button>
              </div>
            )}
          </div>
        )}
        {!info.noLiquidity && (currentPrice || info.isLoading) && (
          <dl className="min-h-[76px] space-y-1" aria-busy={!currentPrice}>
            <dt className="text-xs leading-5 text-muted-foreground">
              Current price
            </dt>
            <dd className="flex flex-col gap-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <div className="relative w-40 max-w-full shrink-0 text-xl font-semibold leading-7 tabular-nums text-foreground break-all">
                  <span aria-hidden={!currentPrice}>
                    {currentPrice
                      ? `${useUsd ? '$' : ''}${currentPrice}`
                      : '\u00a0'}
                  </span>
                  {!currentPrice && (
                    <div
                      className="absolute inset-0"
                      role="status"
                      aria-label="Loading current price"
                    >
                      <SkeletonText fontSize="xl" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <span className="text-xs leading-5 text-muted-foreground">
                  {useUsd ? '' : `${quote?.symbol ?? 'Token'} `}per{' '}
                  {base?.symbol}
                </span>
              </div>
              {currentPrice &&
                useUsd &&
                (!isUsableUsdPrice(basePrice.data) || basePrice.isError) && (
                  <span className="text-xs leading-5 text-muted-foreground">
                    Pool-derived USD estimate
                  </span>
                )}
            </dd>
          </dl>
        )}
        <div className="flex flex-col gap-2">
          <Label className="!font-semibold !leading-5">Deposit tokens</Label>
          <SegmentedControl<Field | 'both'>
            label="Deposit tokens"
            className="max-w-full flex-wrap"
            value={
              bothTokensSelected
                ? 'both'
                : (selectedSingleTokenOption?.field ?? null)
            }
            onValueChange={selectDepositTokens}
            options={[
              {
                value: 'both',
                label: 'Both tokens',
                disabled: locked || !info.poolForPosition,
              },
              ...singleTokenOptions.map((option) => ({
                value: option.field,
                label: `${option.token?.symbol ?? (option.field === Field.CURRENCY_A ? 'Token 1' : 'Token 2')} only`,
                disabled: locked || !option.range,
              })),
            ]}
          />
          <TextFieldDescription className="!text-xs leading-5">
            {!info.poolForPosition && info.noLiquidity
              ? 'Enter a valid starting price to choose deposit tokens.'
              : singleToken
                ? `This range currently needs only ${singleToken.symbol}. Fees are earned only while the price is inside your range.`
                : 'Both tokens sets a full range. Adjust the limits below.'}
          </TextFieldDescription>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <SimplePriceField
            key={`min:${inverted}:${useUsd}`}
            id="simple-min-price"
            label="Min Price"
            token0={base}
            token1={quote}
            unit={unitLabel}
            units={units}
            value={(inverted ? rightPrice : leftPrice)?.toSignificant(18) ?? ''}
            limitValue={info.ticksAtLimit[lowerTickBound] ? '0' : undefined}
            onCommit={(value) => commitRange(Bound.LOWER, value)}
            steps={lowerSteps}
            decrementDisabled={!!info.ticksAtLimit[lowerTickBound]}
            incrementDisabled={!!info.ticksAtLimit[lowerTickBound]}
            locked={locked}
          />
          <SimplePriceField
            key={`max:${inverted}:${useUsd}`}
            id="simple-max-price"
            label="Max Price"
            token0={base}
            token1={quote}
            unit={unitLabel}
            units={units}
            value={(inverted ? leftPrice : rightPrice)?.toSignificant(18) ?? ''}
            limitValue={info.ticksAtLimit[upperTickBound] ? '∞' : undefined}
            onCommit={(value) => commitRange(Bound.UPPER, value)}
            steps={upperSteps}
            decrementDisabled={!!info.ticksAtLimit[upperTickBound]}
            incrementDisabled={!!info.ticksAtLimit[upperTickBound]}
            locked={locked}
          />
        </div>
      </div>
    </FormSection>
  )
}
