import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { Button, classNames, Typography } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import { Web3Input } from '@sushiswap/wagmi'
import { FC, useState } from 'react'

import { KashiPair } from '../../.graphclient'
import { useTokensFromKashiPair } from '../../lib/hooks'
import { useCustomTokens } from '../../lib/state/storage'
import { useTokens } from '../../lib/state/token-lists'

interface DepositWidget {
  pair: KashiPair
  side: 'lend' | 'borrow'
}

export const DepositWidget: FC<DepositWidget> = ({ pair, side }) => {
  const tokenMap = useTokens(pair.chainId)
  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(pair.chainId)
  const [value, setValue] = useState('')
  const [lendValue, setLendValue] = useState('')
  const { collateral, asset } = useTokensFromKashiPair(pair)
  const [leverage, setLeverage] = useState<number>(0)

  return (
    <div className="flex flex-col">
      <Widget id="depositCollateral" maxWidth="md">
        <Widget.Content>
          <Widget.Header title="Deposit Collateral" />
          <Web3Input.Currency
            className="p-3"
            loading={false}
            value={value}
            onChange={setValue}
            currency={side === 'lend' ? collateral : asset}
            customTokenMap={customTokensMap}
            onAddToken={addCustomToken}
            onRemoveToken={removeCustomToken}
            chainId={pair.chainId}
            tokenMap={tokenMap}
          />
        </Widget.Content>
        <Transition
          show={!!value}
          className="z-10"
          enter="ease-out duration-300 delay-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="flex items-center justify-center -mt-[11px] -mb-[11px]">
            <div className="group bg-slate-700 p-0.5 border border-slate-800/30 ring-1 ring-slate-200/10 transition-all rounded-full">
              <ChevronDownIcon width={16} height={16} className="text-slate-400" />
            </div>
          </div>
        </Transition>
        <Transition
          show={!!value}
          unmount={false}
          className="transition-[max-height] overflow-hidden border-t border-slate-200/10 bg-slate-800/30"
          enter="duration-300 ease-in-out"
          enterFrom="transform max-h-0"
          enterTo="transform max-h-[380px]"
          leave="transition-[max-height] duration-250 ease-in-out"
          leaveFrom="transform max-h-[380px]"
          leaveTo="transform max-h-0"
        >
          <Widget id="depositCollateral" maxWidth="md" className="shadow-none bg-transparent">
            <Widget.Content>
              <Widget.Header title={`Lend ${side === 'lend' ? asset.symbol : collateral.symbol}`} />
              <Web3Input.Currency
                className="p-3"
                loading={false}
                value={lendValue}
                onChange={setLendValue}
                currency={side === 'lend' ? asset : collateral}
                customTokenMap={customTokensMap}
                onAddToken={addCustomToken}
                onRemoveToken={removeCustomToken}
                chainId={pair.chainId}
                tokenMap={tokenMap}
              />
              <div className="p-3 flex flex-col gap-3">
                <Disclosure>
                  {({ open }) => (
                    <div className="flex flex-col gap-2 rounded-xl bg-white bg-opacity-[0.08] px-4 py-2">
                      <Disclosure.Button className="flex justify-between items-center">
                        <Typography variant="sm" weight={500} className="text-slate-200">
                          Leverage
                        </Typography>
                        <div className="flex items-center gap-2">
                          <Typography variant="sm" weight={600} className="text-slate-50">
                            {leverage === 0
                              ? '0.00x'
                              : leverage === 1
                              ? '0.50x'
                              : leverage === 2
                              ? '1.00x'
                              : leverage === 3
                              ? '1.5x'
                              : '2.0x'}
                          </Typography>
                          {leverage === 0 && (
                            <div className="bg-white bg-opacity-[0.12] rounded-xl px-3 py-1.5 text-xs font-bold">
                              None
                            </div>
                          )}
                          <ChevronDownIcon
                            width={24}
                            height={24}
                            className={classNames(
                              open ? '!rotate-180' : '',
                              'rotate-0 transition-[transform] duration-300 ease-in-out delay-200 text-slate-300'
                            )}
                          />
                        </div>
                      </Disclosure.Button>
                      <Transition
                        show={open}
                        unmount={false}
                        className="transition-[max-height] overflow-hidden"
                        enter="duration-300 ease-in-out"
                        enterFrom="transform max-h-0"
                        enterTo="transform max-h-[380px]"
                        leave="transition-[max-height] duration-250 ease-in-out"
                        leaveFrom="transform max-h-[380px]"
                        leaveTo="transform max-h-0"
                      >
                        <Disclosure.Panel as="div" className="flex gap-2 justify-end">
                          <button
                            onClick={() => setLeverage(0)}
                            className="bg-white bg-opacity-[0.12] hover:bg-opacity-[0.20] font-medium text-sm rounded-lg px-2 py-1"
                          >
                            0.0x
                          </button>
                          <button
                            onClick={() => setLeverage(1)}
                            className="bg-white bg-opacity-[0.12] hover:bg-opacity-[0.20] font-medium text-sm rounded-lg px-2 py-1"
                          >
                            0.5x
                          </button>
                          <button
                            onClick={() => setLeverage(2)}
                            className="bg-white bg-opacity-[0.12] hover:bg-opacity-[0.20] font-medium text-sm  rounded-lg px-2 py-1"
                          >
                            1.0x
                          </button>
                          <button
                            onClick={() => setLeverage(3)}
                            className="bg-white bg-opacity-[0.12] hover:bg-opacity-[0.20] font-medium text-sm  rounded-lg px-2 py-1"
                          >
                            1.5x
                          </button>
                          <button
                            onClick={() => setLeverage(4)}
                            className="bg-white bg-opacity-[0.12] hover:bg-opacity-[0.20] font-medium text-sm  rounded-lg px-2 py-1"
                          >
                            2.0x
                          </button>
                        </Disclosure.Panel>
                      </Transition>
                    </div>
                  )}
                </Disclosure>
                <Button color="blue" fullWidth>
                  Enter Amount
                </Button>
              </div>
            </Widget.Content>
          </Widget>
        </Transition>
      </Widget>
    </div>
  )
}
