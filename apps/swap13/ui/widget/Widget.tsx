'use client'

import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { ChainId } from '@sushiswap/chain'
import { SUSHI, Type } from '@sushiswap/currency'
import { Widget as UIWidget } from '@sushiswap/ui13/components/widget'
import { Web3Input } from '@sushiswap/wagmi13/components/Web3Input'
import React, { FC, useState } from 'react'

export const Widget: FC = () => {
  const [currencyA, setCurrencyA] = useState<Type>(SUSHI[ChainId.ETHEREUM])
  const [valueA, setValueA] = useState<string>('')

  return (
    <UIWidget id="swap-widget" maxWidth={400} className="relative bg-slate-700">
      <UIWidget.Content>
        <Web3Input.Currency
          className="p-3"
          chainId={ChainId.ETHEREUM}
          onSelect={setCurrencyA}
          value={valueA}
          onChange={setValueA}
          currency={currencyA}
        />
        <div className="absolute left-0 right-0 -mt-3 flex items-center justify-center z-10">
          <button
            type="button"
            className=" group bg-slate-700 p-1 border-2 border-slate-800 transition-all rounded-full hover:ring-2 hover:ring-slate-500 cursor-pointer"
          >
            <div className="transition-all rotate-0 group-hover:rotate-180 group-hover:delay-200">
              <ChevronDownIcon strokeWidth={2} className="w-3 h-3" />
            </div>
          </button>
        </div>
        <div className="bg-slate-800">
          <Web3Input.Currency
            className="p-3"
            chainId={ChainId.ETHEREUM}
            onSelect={setCurrencyA}
            value={valueA}
            onChange={setValueA}
            currency={currencyA}
          />
        </div>
      </UIWidget.Content>
    </UIWidget>
  )
}
