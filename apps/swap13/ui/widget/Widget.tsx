'use client'

import { RadioGroup } from '@headlessui/react'
import { ArrowTrendingUpIcon } from '@heroicons/react/20/solid'
import { ArrowDownIcon } from '@heroicons/react/24/outline'
import { ChainId } from '@sushiswap/chain'
import { Native, SUSHI, Type } from '@sushiswap/currency'
import { classNames } from '@sushiswap/ui13'
import { Button } from '@sushiswap/ui13/components/button'
import Container from '@sushiswap/ui13/components/Container'
import { Widget as UIWidget } from '@sushiswap/ui13/components/widget'
import { AppType } from '@sushiswap/ui13/types'
import { Web3Input } from '@sushiswap/wagmi13/components/Web3Input'
import React, { FC, useState } from 'react'

export const Widget: FC = () => {
  const [currencyA, setCurrencyA] = useState<Type>(Native.onChain(ChainId.ETHEREUM))
  const [currencyB, setCurrencyB] = useState<Type>(SUSHI[ChainId.ETHEREUM])

  const [valueA, setValueA] = useState<string>('')
  const [valueB, setValueB] = useState<string>('')

  return (
    <>
      <Container maxWidth={520} className="mx-auto mt-16 flex flex-col gap-4">
        <div className="flex flex-col gap-2 mb-4">
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-slate-200">Sell {currencyA.symbol}</h1>
          <span className="text-sm flex items-center gap-1 font-semibold text-blue-600">
            <ArrowTrendingUpIcon width={16} height={16} />1 {currencyA.symbol} = 0.05 {currencyB.symbol}
          </span>
        </div>
        <RadioGroup defaultValue={AppType.Swap} className="flex gap-2">
          <RadioGroup.Option
            value={AppType.Swap}
            className={({ checked }) =>
              classNames(
                checked
                  ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white'
                  : 'dark:text-slate-600 text-gray-400 hover:text-gray-900 hover:dark:text-white',
                'transition-all cursor-pointer text-sm rounded-lg px-4 py-1.5 font-medium'
              )
            }
          >
            {AppType.Swap}
          </RadioGroup.Option>
          <RadioGroup.Option
            className={({ checked }) =>
              classNames(
                checked
                  ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white'
                  : 'dark:text-slate-600 text-gray-400 hover:text-gray-900 hover:dark:text-white',
                'transition-all cursor-pointer text-sm rounded-lg px-4 py-1.5 font-medium'
              )
            }
            value={AppType.xSwap}
          >
            {AppType.xSwap}
          </RadioGroup.Option>
        </RadioGroup>
        <div>
          <UIWidget.Content>
            <Web3Input.Currency
              className="p-3 pb-6 dark:bg-slate-800 bg-white rounded-xl"
              chainId={ChainId.ETHEREUM}
              onSelect={setCurrencyA}
              value={valueA}
              onChange={setValueA}
              currency={currencyA}
            />
            <div className="left-0 right-0 mt-[-9px] mb-[-9px] flex items-center justify-center z-10">
              <button
                type="button"
                className="group bg-gray-100 dark:bg-slate-900 p-2 border-white transition-all rounded-full cursor-pointer"
              >
                <div className="transition-all rotate-0 group-hover:rotate-180 group-hover:delay-200">
                  <ArrowDownIcon strokeWidth={3} className="w-4 h-4 text-blue" />
                </div>
              </button>
            </div>
            <Web3Input.Currency
              className="p-3 pb-6 dark:bg-slate-800 bg-white rounded-xl"
              chainId={ChainId.ETHEREUM}
              onSelect={setCurrencyB}
              value={valueB}
              onChange={setValueB}
              currency={currencyB}
              usdPctChange={1.12}
            />
          </UIWidget.Content>
        </div>
      </Container>
      <Container maxWidth={500} className="fixed bottom-6 mx-auto left-4 right-4 w-[unset]">
        <Button fullWidth size="md">
          Swap {currencyA.symbol} for {currencyB.symbol}
        </Button>
      </Container>
    </>
  )
}
