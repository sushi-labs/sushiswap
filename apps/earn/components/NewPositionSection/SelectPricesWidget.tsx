import { RadioGroup } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { Amount, Native, Price, SUSHI, Type } from '@sushiswap/currency'
import { classNames } from '@sushiswap/ui'
import React, { FC, useCallback, useState } from 'react'

import { Bound } from '../../lib/constants'
import { useAddPositionState } from '../AddPositionProvider'

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

export const SelectPricesWidget: FC = () => {
  const { token0, token1, chainId, fee } = useAddPositionState()
  const [range, setRange] = useState<Range>(Range.Unset)
  const [chartType, setChartType] = useState<ChartType>(ChartType.Liquidity)
  const [minPrice, setMinPrice] = useState<number>(525.15)
  const [maxPrice, setMaxPrice] = useState<number>(1515.17)
  const [independentRangeField, setIndependentRangeField] = useState<'LOWER' | 'UPPER'>('LOWER')

  // TODO
  const [priceLower] = useState(
    new Price({
      baseAmount: Amount.fromRawAmount(Native.onChain(chainId).wrapped, '100000000'),
      quoteAmount: Amount.fromRawAmount(SUSHI[chainId], '1000000'),
    })
  )
  const [priceUpper] = useState(
    new Price({
      baseAmount: Amount.fromRawAmount(Native.onChain(chainId).wrapped, '200000000'),
      quoteAmount: Amount.fromRawAmount(SUSHI[chainId], '1000000'),
    })
  )
  const invertPrice = false
  const price = undefined
  const onLeftRangeInput = useCallback((val: string) => {}, [])
  const onRightRangeInput = useCallback((val: string) => {}, [])
  const hasExistingPosition = false
  const ticksAtLimit = {
    [Bound.LOWER]: false,
    [Bound.UPPER]: false,
  }

  return (
    <div>
      <div className="flex justify-between">
        <span className="text-sm font-bold text-slate-200 flex-grow px-3">Prices</span>
        <RadioGroup
          value={chartType}
          onChange={setChartType}
          className="flex cursor-pointer border border-slate-200/10 rounded-lg overflow-hidden"
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

      <div className="flex items-center justify-center h-[200px] border border-slate-200/10 rounded-lg mt-4">
        <span className="text-[10px] italic text-slate-500">Liquidity chart here</span>
      </div>
      {/*<LiquidityChartRangeInput*/}
      {/*  currencyA={token0 ?? undefined}*/}
      {/*  currencyB={token1 ?? undefined}*/}
      {/*  feeAmount={fee}*/}
      {/*  ticksAtLimit={ticksAtLimit}*/}
      {/*  price={price ? parseFloat((invertPrice ? price.invert() : price).toSignificant(8)) : undefined}*/}
      {/*  priceLower={priceLower}*/}
      {/*  priceUpper={priceUpper}*/}
      {/*  onLeftRangeInput={onLeftRangeInput}*/}
      {/*  onRightRangeInput={onRightRangeInput}*/}
      {/*  interactive={!hasExistingPosition}*/}
      {/*/>*/}
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
                      checked ? 'ring-1 ring-blue' : 'hover:ring-1 hover:ring-slate-200/20',
                      'cursor-pointer rounded-full px-3 bg-white/[0.04] text-xs py-1.5 font-semibold w-full whitespace-nowrap flex justify-center'
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
            subtitle="-50%"
            value={minPrice}
            onMin={() => setMinPrice((prev) => prev - 1)}
            onPlus={() => setMinPrice((prev) => prev + 1)}
          />
          <PriceBlock
            token0={token0}
            token1={token1}
            label="Max Price."
            subtitle="+100%"
            value={maxPrice}
            onMin={() => setMaxPrice((prev) => prev - 1)}
            onPlus={() => setMaxPrice((prev) => prev + 1)}
          />
        </div>
      </div>
    </div>
  )
}

interface PriceBlockProps {
  token0: Type | undefined
  token1: Type | undefined
  label: string
  value: number | undefined
  subtitle: string
  onPlus(): void
  onMin(): void
}

export const PriceBlock: FC<PriceBlockProps> = ({ token0, token1, label, value, subtitle, onMin, onPlus }) => {
  return (
    <div className="flex flex-col gap-2 w-full bg-white/[0.04] border border-slate-200/10 rounded-lg p-3">
      <p className="font-medium text-xs text-slate-300">
        {label} <span className="text-slate-500">({subtitle})</span>
      </p>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="font-semibold text-slate-50">{value}</p>
          <p className="font-medium text-[10px] text-slate-400">
            {token1?.symbol} per {token0?.symbol}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={onPlus}
            className="hover:bg-slate-600 flex items-center justify-center w-5 h-5 bg-slate-700 rounded-full"
          >
            <PlusIcon width={12} height={12} />
          </button>
          <button
            onClick={onMin}
            className="hover:bg-slate-600 flex items-center justify-center w-5 h-5 bg-slate-700 rounded-full"
          >
            <MinusIcon width={12} height={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
