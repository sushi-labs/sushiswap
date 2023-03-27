import { RadioGroup } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { Type } from '@sushiswap/currency'
import { classNames } from '@sushiswap/ui'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'

import { Bound } from '../../lib/constants'
import { ContentBlock } from '../AddPage/ContentBlock'
import LiquidityChartRangeInput from '../LiquidityChartRangeInput'
import { useConcentratedMintActionHandlers } from '../ConcentratedLiquidityProvider'
import { Input } from '@sushiswap/ui/future/components/input'
import { useConcentratedDerivedMintInfo, useRangeHopCallbacks } from '../../lib/hooks/useConcentratedDerivedMintInfo'
import { Fee } from '@sushiswap/amm'

enum ChartType {
  Liquidity = 'Liquidity',
  Price = 'Price',
}

enum Range {
  Unset = 'Unset',
  Full = 'Full Range',
  Double = 'x ÷ 2',
  Twenty = 'x ÷ 1.2',
  One = 'x ÷ 1.01',
}

interface SelectPricesWidget {
  token0: Type | undefined
  token1: Type | undefined
  feeAmount: Fee
}

export const SelectPricesWidget: FC<SelectPricesWidget> = ({ token0, token1, feeAmount }) => {
  const [range, setRange] = useState<Range>(Range.Unset)
  const [chartType, setChartType] = useState<ChartType>(ChartType.Liquidity)
  const { ticks, pricesAtTicks, ticksAtLimit, pool } = useConcentratedDerivedMintInfo(
    token0,
    token1,
    feeAmount,
    token0,
    false
  )
  const { onLeftRangeInput, onRightRangeInput } = useConcentratedMintActionHandlers()

  // TODO
  const hasExistingPosition = false

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

  const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper } = useRangeHopCallbacks(
    token0,
    token1,
    feeAmount,
    tickLower,
    tickUpper,
    pool
  )

  const isSorted = token0 && token1 && token0.wrapped.sortsBefore(token1.wrapped)
  const leftPrice = useMemo(() => (isSorted ? priceLower : priceUpper?.invert()), [])
  const rightPrice = useMemo(() => (isSorted ? priceUpper : priceLower?.invert()), [])

  return (
    <ContentBlock
      title={
        <>
          What <span className="text-gray-900 dark:text-white">price range</span> do you want to add liquidity to?
        </>
      }
    >
      <div>
        <div className="flex justify-end mb-3">
          <RadioGroup
            value={chartType}
            onChange={setChartType}
            className="flex cursor-pointer rounded-lg overflow-hidden"
          >
            {Object.keys(ChartType).map((val, i) => (
              <RadioGroup.Option
                key={val}
                className={({ checked }) =>
                  classNames(checked ? 'bg-white/[0.04]' : 'bg-slate-900 opacity-40', 'text-[10px] px-2 py-1')
                }
                value={val}
              >
                {val}
              </RadioGroup.Option>
            ))}
          </RadioGroup>
        </div>
        <LiquidityChartRangeInput
          currencyA={token0}
          currencyB={token1}
          feeAmount={feeAmount}
          ticksAtLimit={ticksAtLimit}
          // price={price ? parseFloat((invertPrice ? price.invert() : price).toSignificant(8)) : undefined}
          price={undefined}
          priceLower={priceLower}
          priceUpper={priceUpper}
          onLeftRangeInput={onLeftRangeInput}
          onRightRangeInput={onRightRangeInput}
          interactive={!hasExistingPosition}
        />
        <div className="flex flex-col gap-3 pt-4">
          <RadioGroup value={range} onChange={setRange} className="flex gap-2">
            {Object.keys(Range)
              .slice(1)
              .map((val) => {
                return (
                  <RadioGroup.Option
                    key={val}
                    className={({ checked }) =>
                      classNames(
                        checked ? 'ring-2 ring-blue bg-white/[0.08]' : '',
                        'cursor-pointer rounded-full px-3 bg-white/[0.04] hover:bg-white/[0.08] text-xs py-1.5 font-semibold w-full whitespace-nowrap flex justify-center'
                      )
                    }
                    value={val}
                  >
                    {Object.values(Range)[Object.keys(Range).indexOf(val)]}
                  </RadioGroup.Option>
                )
              })}
          </RadioGroup>
          <div className="flex gap-2">
            <PriceBlock
              token0={token0}
              token1={token1}
              label="Min Price."
              value={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] ? '0' : leftPrice?.toSignificant(5) ?? ''}
              onUserInput={onLeftRangeInput}
              decrement={isSorted ? getDecrementLower : getIncrementUpper}
              increment={isSorted ? getIncrementLower : getDecrementUpper}
              decrementDisabled={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]}
              incrementDisabled={ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]}
            />
            <PriceBlock
              token0={token0}
              token1={token1}
              label="Max Price."
              value={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] ? '∞' : rightPrice?.toSignificant(5) ?? ''}
              onUserInput={onRightRangeInput}
              decrement={isSorted ? getDecrementUpper : getIncrementLower}
              increment={isSorted ? getIncrementUpper : getDecrementLower}
              incrementDisabled={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
              decrementDisabled={ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]}
            />
          </div>
        </div>
      </div>
    </ContentBlock>
  )
}

interface PriceBlockProps {
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
}

export const PriceBlock: FC<PriceBlockProps> = ({
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
}) => {
  //  for focus state, styled components doesnt let you select input parent container
  const [active, setActive] = useState(false)

  // let user type value and only update parent value on blur
  const [localValue, setLocalValue] = useState('')
  const [useLocalValue, setUseLocalValue] = useState(false)

  // animation if parent value updates local value
  const [pulsing, setPulsing] = useState<boolean>(false)

  const handleOnFocus = () => {
    setUseLocalValue(true)
    setActive(true)
  }

  const handleOnBlur = useCallback(() => {
    setUseLocalValue(false)
    setActive(false)
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
        setPulsing(true) // trigger animation
        setTimeout(function () {
          setPulsing(false)
        }, 1800)
      }, 0)
    }
  }, [localValue, useLocalValue, value])

  return (
    <div
      onBlur={handleOnBlur}
      onFocus={handleOnFocus}
      className={classNames(
        active ? 'ring-2 ring-blue' : '',
        'flex flex-col gap-2 w-full bg-white/[0.04] rounded-lg p-3'
      )}
    >
      <p className="font-medium text-xs text-slate-300">{label}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <Input.Numeric value={value} onUserInput={onUserInput} disabled={locked} />
          <p className="font-medium text-[10px] text-slate-400">
            {token1?.symbol} per {token0?.symbol}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            disabled={incrementDisabled}
            onClick={handleIncrement}
            className={classNames(
              incrementDisabled ? 'opacity-40' : '',
              'hover:bg-slate-600 flex items-center justify-center w-5 h-5 bg-slate-700 rounded-full'
            )}
          >
            <PlusIcon width={12} height={12} />
          </button>
          <button
            disabled={decrementDisabled}
            onClick={handleDecrement}
            className={classNames(
              decrementDisabled ? 'opacity-40' : '',
              'hover:bg-slate-600 flex items-center justify-center w-5 h-5 bg-slate-700 rounded-full'
            )}
          >
            <MinusIcon width={12} height={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
