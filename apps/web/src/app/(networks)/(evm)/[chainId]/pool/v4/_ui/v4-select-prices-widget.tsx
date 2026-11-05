'use client'

import { useIsMounted } from '@sushiswap/hooks'
import {
  Card,
  CardDescription,
  CardHeader,
  FormSection,
  Message,
  classNames,
} from '@sushiswap/ui'
import { type ReactElement, type ReactNode, useCallback } from 'react'
import { Bound } from 'src/lib/constants'
import { PRICE_RANGE_MULTIPLIERS, PriceRange } from 'src/lib/pool/cl'
import { useV4PoolDensityChartData } from 'src/lib/pool/v4'
import type { EvmCurrency, SushiSwapV4ChainId } from 'sushi/evm'
import type { Hex } from 'viem'
import { useConcentratedMintActionHandlers } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import {
  useRangeInput,
  useStartPriceInput,
} from '~evm/[chainId]/_ui/concentrated-liquidity-provider/use-range-input'
import {
  LiquidityChartRangeInputView,
  getZoomLevels,
} from '~evm/[chainId]/_ui/liquidity-chart-range-input'
import {
  RangePresetToggles,
  RangePriceInputs,
  RangeStat,
  RangeTokenToggle,
  StartPriceInput,
  useRangeRatio,
} from '~evm/[chainId]/_ui/select-prices-widget/range-controls'
import type { V4DerivedMintInfo } from './use-v4-derived-mint-info'

const PRICE_RANGE_OPTIONS = [
  { label: 'Full Range', value: PriceRange.FULL_RANGE },
  ...PRICE_RANGE_MULTIPLIERS,
]

interface V4SelectPricesWidgetProps {
  chainId: SushiSwapV4ChainId
  currencyA: EvmCurrency | undefined
  currencyB: EvmCurrency | undefined
  /** The pool's ID, for its liquidity chart; unset for a pool to create. */
  poolId: Hex | undefined
  derived: V4DerivedMintInfo
  switchTokens?(): void
}

export function V4SelectPricesWidget({
  chainId,
  currencyA,
  currencyB,
  poolId,
  derived,
  switchTokens,
}: V4SelectPricesWidgetProps): ReactElement {
  const isMounted = useIsMounted()
  const {
    price,
    invertPrice,
    ticks,
    poolForPosition,
    noLiquidity,
    tickSpacing,
  } = derived

  const { onFieldAInput, onFieldBInput } = useConcentratedMintActionHandlers()
  const range = useRangeInput({
    currency0: derived.currency0,
    currency1: derived.currency1,
    invertPrice,
    tickSpacing,
    tickCurrent: poolForPosition?.tickCurrent,
    ticks,
  })
  const startPrice = useStartPriceInput({
    currency0: derived.currency0,
    currency1: derived.currency1,
    price,
    invertPrice,
  })
  const { valueRatio, capitalEfficiency } = useRangeRatio(
    price,
    derived.pricesAtTicks,
    invertPrice,
  )

  // The range and start price don't depend on which currency is base; the
  // amounts are of a currency, so they clear
  const handleSwitchTokens = useCallback(() => {
    switchTokens?.()
    onFieldAInput('')
    onFieldBInput('')
  }, [switchTokens, onFieldAInput, onFieldBInput])

  const tokenToggle = switchTokens ? (
    <RangeTokenToggle
      currencyA={currencyA}
      currencyB={currencyB}
      invertPrice={invertPrice}
      onSwitch={handleSwitchTokens}
    />
  ) : undefined

  return (
    <FormSection
      title="Range"
      description="Select a price range to provide liquidity. You will not earn any fees when prices move outside of this range."
    >
      <div
        className={classNames(
          'flex flex-col gap-6',
          !currencyA || !currencyB || !tickSpacing
            ? 'opacity-40 pointer-events-none'
            : '',
        )}
      >
        {noLiquidity ? (
          <div className="flex flex-col gap-3">
            {tokenToggle}
            <Message size="sm" variant="muted" className="text-center">
              This pool must be initialized before you can add liquidity. To
              initialize, select a starting price for the pool. Then, enter your
              liquidity price range and deposit amount. Gas fees will be higher
              than usual due to the initialization.
            </Message>
            <StartPriceInput
              currencyA={currencyA}
              currencyB={currencyB}
              value={startPrice.value}
              onChange={startPrice.onChange}
            />
          </div>
        ) : isMounted && currencyA && currencyB && poolId ? (
          <V4RangeChart
            chainId={chainId}
            poolId={poolId}
            currencyA={currencyA}
            currencyB={currencyB}
            derived={derived}
            priceRange={range.preset}
            onLeftRangeInput={range.setMinPrice}
            onRightRangeInput={range.setMaxPrice}
            tokenToggle={tokenToggle}
          />
        ) : null}
        <RangePresetToggles
          options={PRICE_RANGE_OPTIONS}
          range={range}
          // Deselecting clears only the range, keeping a start price
          onDeselect={() => range.setRange(undefined, undefined)}
        />
        <Card>
          <CardHeader>
            <CardDescription className="flex flex-col gap-3 !text-accent-foreground">
              <RangeStat
                label={
                  currencyA && currencyB
                    ? `Token Ratio (${currencyA.symbol} : ${currencyB.symbol})`
                    : 'Token Ratio'
                }
                explainer="This is the ratio of the cash values of the two underlying tokens in this position."
              >
                {valueRatio
                  ? `${(valueRatio[0] * 100).toFixed(0)}% : ${(valueRatio[1] * 100).toFixed(0)}%`
                  : '-'}
              </RangeStat>
              <RangeStat
                label="Capital Efficiency"
                explainer="The narrower the price range, the higher the capital efficiency. 2x means one unit of liquidity here would need 2x the capital in a full range position."
              >
                {capitalEfficiency ? `${capitalEfficiency.toFixed(2)}x` : '-'}
              </RangeStat>
            </CardDescription>
          </CardHeader>
        </Card>
        <RangePriceInputs
          currencyA={currencyA}
          currencyB={currencyB}
          pricesAtTicks={derived.pricesAtTicks}
          ticksAtLimit={derived.ticksAtLimit}
          invertPrice={invertPrice}
          range={range}
        />
      </div>
    </FormSection>
  )
}

function V4RangeChart({
  chainId,
  poolId,
  currencyA,
  currencyB,
  derived: { price, ticksAtLimit, pricesAtTicks, tickSpacing, invertPrice },
  priceRange,
  onLeftRangeInput,
  onRightRangeInput,
  tokenToggle,
}: {
  chainId: SushiSwapV4ChainId
  poolId: Hex
  currencyA: EvmCurrency
  currencyB: EvmCurrency
  derived: V4DerivedMintInfo
  priceRange: PriceRange | undefined
  onLeftRangeInput(input: string): void
  onRightRangeInput(input: string): void
  tokenToggle: ReactNode
}) {
  // Density prices are of currencyA, as the chart's bounds are
  const chart = useV4PoolDensityChartData({
    chainId,
    poolId,
    token0: currencyA,
    token1: currencyB,
  })

  // The form's price, of currencyA, so the chart agrees with the range math
  const currentPrice = price
    ? Number.parseFloat((invertPrice ? price.invert() : price).toSignificant(8))
    : undefined

  return (
    <LiquidityChartRangeInputView
      currencyA={currencyA}
      currencyB={currencyB}
      ticksAtLimit={ticksAtLimit}
      priceRange={priceRange}
      price={currentPrice}
      priceLower={pricesAtTicks[Bound.LOWER]}
      priceUpper={pricesAtTicks[Bound.UPPER]}
      weightLockedCurrencyBase={undefined}
      onLeftRangeInput={onLeftRangeInput}
      onRightRangeInput={onRightRangeInput}
      interactive
      tokenToggle={tokenToggle}
      densityData={{
        isLoading: chart.isLoading,
        error: chart.error,
        // A pool without liquidity, not one to create
        data: chart.isEmpty ? [] : chart.series,
      }}
      zoomLevels={getZoomLevels(tickSpacing)}
      isSorted={!invertPrice}
    />
  )
}
