'use client'

import { RadioGroup } from '@headlessui/react'
import { ArrowTrendingUpIcon } from '@heroicons/react/20/solid'
import { ArrowDownIcon } from '@heroicons/react/24/outline'
import { Button } from '@sushiswap/ui13/components/button'
import Container from '@sushiswap/ui13/components/Container'
import { Widget as UIWidget } from '@sushiswap/ui13/components/widget'
import { AppType } from '@sushiswap/ui13/types'
import { Web3Input } from '@sushiswap/wagmi13/components/Web3Input'
import React, { FC } from 'react'

import { NetworkSelectorDialog } from '../NetworkSelectorDialog'
import { useSwapActions, useSwapState } from '../TradeProvider'

export const Widget: FC = () => {
  const { appType, token0, token1, value, otherValue, network0, network1 } = useSwapState()
  const { setAppType, setToken0, setToken1, setNetwork0, setNetwork1, setValue } = useSwapActions()

  return (
    <>
      <Container maxWidth={520} className="mx-auto mt-16 mb-[86px] flex flex-col gap-4">
        <div className="flex flex-col gap-2 mb-4">
          {appType === AppType.Swap ? (
            <h1 className="text-4xl font-semibold text-gray-900 dark:text-slate-200">Sell {token0.symbol}</h1>
          ) : (
            <>
              <h1 className="flex items-center gap-3 text-4xl font-semibold text-gray-900 dark:text-slate-200">
                Sell {token0.symbol} on <NetworkSelectorDialog selected={network0} onSelect={setNetwork0} />
              </h1>
              <h1 className="flex items-center gap-3 text-4xl font-semibold text-gray-900 dark:text-slate-200">
                Receive {token1.symbol} on <NetworkSelectorDialog selected={network1} onSelect={setNetwork1} />
              </h1>
            </>
          )}
          <span className="text-sm flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
            <ArrowTrendingUpIcon width={16} height={16} />1 {token0.symbol} = 0.05 {token1.symbol}
          </span>
        </div>
        <RadioGroup value={appType} onChange={setAppType} className="flex gap-2">
          <RadioGroup.Option
            as={Button}
            variant={appType === AppType.Swap ? 'outlined' : 'empty'}
            size="sm"
            value={AppType.Swap}
            color="default"
            className={({ checked }: { checked: boolean }) =>
              checked
                ? 'text-gray-900 dark:text-slate-200'
                : 'dark:text-slate-600 text-gray-400 hover:text-gray-900 hover:dark:text-white'
            }
          >
            {AppType.Swap}
          </RadioGroup.Option>
          <RadioGroup.Option
            as={Button}
            variant={appType === AppType.xSwap ? 'outlined' : 'empty'}
            size="sm"
            value={AppType.xSwap}
            color="default"
            className={({ checked }: { checked: boolean }) =>
              checked
                ? 'text-gray-900 dark:text-white'
                : 'dark:text-slate-600 text-gray-400 hover:text-gray-900 hover:dark:text-white'
            }
          >
            {AppType.xSwap}
          </RadioGroup.Option>
        </RadioGroup>
        <div>
          <UIWidget.Content>
            <Web3Input.Currency
              className="p-3 pb-6 dark:bg-slate-800 bg-white rounded-xl"
              chainId={network0}
              onSelect={setToken0}
              value={value}
              onChange={setValue}
              currency={token0}
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
              chainId={network1}
              onSelect={setToken1}
              value={otherValue}
              currency={token1}
              usdPctChange={1.12}
            />
          </UIWidget.Content>
        </div>
      </Container>

      {/*spacer*/}
      <Container maxWidth={500} className="fixed bottom-6 mx-auto left-4 right-4 w-[unset]">
        <Button fullWidth size="xl">
          Swap {token0.symbol} for {token1.symbol}
        </Button>
      </Container>
    </>
  )
}
