'use client'

import {
  FormSection,
  Label,
  Message,
  TextField,
  TextFieldDescription,
  Toggle,
  classNames,
} from '@sushiswap/ui'
import type { ReactElement } from 'react'
import type { StellarToken } from 'sushi/stellar'
import type { TickRangeSelectorState } from '~stellar/_common/lib/hooks/tick/use-tick-range-selector'
import { TickRangeSelector } from '~stellar/_common/ui/TickRangeSelector/TickRangeSelector'

interface StellarSelectPricesWidgetProps {
  token0: StellarToken | undefined
  token1: StellarToken | undefined
  noLiquidity: boolean
  startPrice: string
  inverted: boolean
  tickRange: TickRangeSelectorState
  onStartPriceChange(value: string): void
  onInvertedChange(value: boolean): void
}

export function StellarSelectPricesWidget({
  token0,
  token1,
  noLiquidity,
  startPrice,
  inverted,
  tickRange,
  onStartPriceChange,
  onInvertedChange,
}: StellarSelectPricesWidgetProps): ReactElement {
  const priceUnit = inverted
    ? `${token0?.symbol ?? 'Token0'} per ${token1?.symbol ?? 'Token1'}`
    : `${token1?.symbol ?? 'Token1'} per ${token0?.symbol ?? 'Token0'}`

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
          !token0 || !token1 ? 'pointer-events-none opacity-40' : '',
        )}
      >
        {noLiquidity ? (
          <div className="flex flex-col gap-2">
            <TokenToggle
              token0={token0}
              token1={token1}
              inverted={inverted}
              onChange={onInvertedChange}
            />
            <Message size="sm" variant="muted" className="text-center">
              This pool must be initialized before you can add liquidity. To
              initialize, select a starting price for the pool. Then, enter your
              liquidity price range and deposit amount. Network fees will be
              higher than usual due to the initialization transaction.
            </Message>
          </div>
        ) : (
          <TokenToggle
            token0={token0}
            token1={token1}
            inverted={inverted}
            onChange={onInvertedChange}
          />
        )}

        {noLiquidity && token0 && token1 ? (
          <div className="flex flex-col gap-3">
            <Label>Start price</Label>
            <TextField
              variant="outline"
              value={startPrice}
              onValueChange={onStartPriceChange}
              testdata-id="start-price-input"
              type="number"
              unit={priceUnit}
            />
            <TextFieldDescription>
              Your pool needs a starting price somewhere between the minimum and
              maximum price.
            </TextFieldDescription>
          </div>
        ) : null}

        <TickRangeSelector
          params={tickRange}
          token0={token0}
          token1={token1}
          inverted={inverted}
          variant="cards"
        />
      </div>
    </FormSection>
  )
}

interface TokenToggleProps {
  token0: StellarToken | undefined
  token1: StellarToken | undefined
  inverted: boolean
  onChange(value: boolean): void
}

function TokenToggle({
  token0,
  token1,
  inverted,
  onChange,
}: TokenToggleProps): ReactElement | null {
  if (!token0 || !token1) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-1">
      <Toggle
        size="sm"
        variant="outline"
        pressed={!inverted}
        onClick={() => onChange(false)}
        className="whitespace-nowrap"
      >
        {token0.symbol}
      </Toggle>
      <Toggle
        size="sm"
        variant="outline"
        pressed={inverted}
        onClick={() => onChange(true)}
        className="whitespace-nowrap"
      >
        {token1.symbol}
      </Toggle>
    </div>
  )
}
