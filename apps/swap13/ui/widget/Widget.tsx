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
    <UIWidget id="swap-widget" maxWidth={400} className="relative p-4">
      <UIWidget.Content>
        <Web3Input.Currency
          chainId={ChainId.ETHEREUM}
          tokenMap={{}}
          customTokenMap={{}}
          onSelect={setCurrencyA}
          onAddToken={() => {}}
          onRemoveToken={() => {}}
          value={valueA}
          onChange={setValueA}
          currency={currencyA}
        />
        <div className="flex items-center justify-center z-10">
          <button
            type="button"
            className=" group bg-slate-700 p-0.5 border-2 border-slate-800 transition-all rounded-full hover:ring-2 hover:ring-slate-500 cursor-pointer"
          >
            <div className="transition-all rotate-0 group-hover:rotate-180 group-hover:delay-200">
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </button>
        </div>
        <Web3Input.Currency
          chainId={ChainId.ETHEREUM}
          tokenMap={{}}
          customTokenMap={{}}
          onSelect={setCurrencyA}
          onAddToken={() => {}}
          onRemoveToken={() => {}}
          value={valueA}
          onChange={setValueA}
          currency={currencyA}
        />
      </UIWidget.Content>
    </UIWidget>
  )
}
