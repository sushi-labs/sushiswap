import { RadioGroup } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native, Price, SUSHI, Type } from '@sushiswap/currency'
import { classNames, Widget } from '@sushiswap/ui'
import React, { FC, useState } from 'react'

import { LiquidityChart } from '../LiquidityChart'

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
  chainId: ChainId
}

export const SelectPricesWidget: FC<SelectPricesWidget> = ({ token0, token1, chainId }) => {
  const [range, setRange] = useState<Range>(Range.Unset)
  const [chartType, setChartType] = useState<ChartType>(ChartType.Liquidity)
  const [minPrice, setMinPrice] = useState<number>(525.15)
  const [maxPrice, setMaxPrice] = useState<number>(1515.17)
  const [independentRangeField, setIndependentRangeField] = useState<'LOWER' | 'UPPER'>('LOWER')

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

  return (
    <Widget id="setPrices" maxWidth={400} className="!bg-slate-800">
      <Widget.Content>
        <Widget.Header title="4. Set Prices" className="!pb-3">
          <RadioGroup value={chartType} onChange={setChartType} className="flex cursor-pointer">
            {Object.keys(ChartType).map((val, i) => (
              <RadioGroup.Option
                key={val}
                className={({ checked }) =>
                  classNames(
                    checked ? 'bg-slate-700' : 'bg-slate-900 opacity-40',
                    'text-[10px] px-2 py-1',
                    i === 0 ? 'rounded-l-lg' : 'rounded-r-lg'
                  )
                }
                value={val}
              >
                {val}
              </RadioGroup.Option>
            ))}
          </RadioGroup>
        </Widget.Header>
        <LiquidityChart
          currencyBase={token0}
          currencyQuote={token1}
          tierId={0}
          priceLower={priceLower}
          priceUpper={priceUpper}
          weightLockedCurrencyBase={undefined}
          onLeftRangeInput={() => {}}
          onRightRangeInput={() => {}}
          setIndependentRangeField={setIndependentRangeField}
          resetRangeNonce={99975}
        />
        <div className="flex flex-col gap-3 p-4 pt-0">
          <RadioGroup value={range} onChange={setRange} className="flex gap-2">
            {Object.keys(Range)
              .slice(1)
              .map((val) => {
                return (
                  <RadioGroup.Option
                    key={val}
                    className={({ checked }) =>
                      classNames(
                        checked ? 'ring-2 ring-blue' : 'hover:ring-2 hover:ring-slate-500',
                        'cursor-pointer rounded-full px-3 bg-slate-600 text-xs py-1.5 font-semibold w-full whitespace-nowrap flex justify-center'
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
      </Widget.Content>
    </Widget>
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
    <div className="flex flex-col gap-2 w-full bg-slate-900 rounded-lg p-3">
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
