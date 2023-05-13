import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon, CogIcon } from '@heroicons/react/outline'
import { PlusIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { useIsMounted } from '@sushiswap/hooks'
import { classNames, Widget } from '@sushiswap/ui'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import React, { FC, ReactNode } from 'react'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/future/components/settings'
import { Button } from '@sushiswap/ui/future/components/button'

interface AddSectionWidgetProps {
  isFarm: boolean
  chainId: ChainId
  input0: string
  input1: string
  token0: Type | undefined
  token1: Type | undefined
  onSelectToken0?(currency: Type): void
  onSelectToken1?(currency: Type): void
  onInput0(value: string): void
  onInput1(value: string): void
  children: ReactNode
}

export const AddSectionWidget: FC<AddSectionWidgetProps> = ({
  isFarm,
  chainId,
  input0,
  input1,
  token0,
  token1,
  onSelectToken0,
  onSelectToken1,
  onInput0,
  onInput1,
  children,
}) => {
  const isMounted = useIsMounted()

  return (
    <Widget id="addLiquidity" maxWidth={400}>
      <Widget.Content>
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <>
              {isFarm && isMounted ? (
                <Widget.Header title="1. Add Liquidity" className="!pb-3 ">
                  <div className="flex gap-3">
                    <SettingsOverlay
                      options={{
                        slippageTolerance: {
                          storageKey: 'addLiquidity',
                          defaultValue: '0.5',
                          title: 'Add Liquidity Slippage',
                        },
                      }}
                      modules={[SettingsModule.CustomTokens, SettingsModule.SlippageTolerance]}
                    >
                      {({ setOpen }) => (
                        <Button variant="outlined" color="default" onClick={() => setOpen(true)}>
                          <CogIcon width={24} height={24} />
                        </Button>
                      )}
                    </SettingsOverlay>
                    <Disclosure.Button className="w-full pr-0.5">
                      <div className="flex items-center justify-between">
                        <div
                          className={classNames(
                            open ? 'rotate-180' : 'rotate-0',
                            'transition-all w-5 h-5 -mr-1.5 flex items-center delay-300'
                          )}
                        >
                          <ChevronDownIcon
                            width={24}
                            height={24}
                            className="text-gray-700 hover:text-gray-800 dark:group-hover:text-slate-200 dark:text-slate-300"
                          />
                        </div>
                      </div>
                    </Disclosure.Button>
                  </div>
                </Widget.Header>
              ) : (
                <Widget.Header title="Add Liquidity" className="!pb-3">
                  <div className="flex gap-3">
                    <SettingsOverlay
                      options={{
                        slippageTolerance: {
                          storageKey: 'addLiquidity',
                          defaultValue: '0.5',
                          title: 'Add Liquidity Slippage',
                        },
                      }}
                      modules={[SettingsModule.CustomTokens, SettingsModule.SlippageTolerance]}
                    >
                      {({ setOpen }) => (
                        <Button variant="outlined" color="default" onClick={() => setOpen(true)}>
                          <CogIcon width={24} height={24} />
                        </Button>
                      )}
                    </SettingsOverlay>
                  </div>
                </Widget.Header>
              )}
              <Transition
                unmount={false}
                className="transition-[max-height] overflow-hidden"
                enter="duration-300 ease-in-out"
                enterFrom="transform max-h-0"
                enterTo="transform max-h-[380px]"
                leave="transition-[max-height] duration-250 ease-in-out"
                leaveFrom="transform max-h-[380px]"
                leaveTo="transform max-h-0"
              >
                <Disclosure.Panel unmount={false}>
                  <Web3Input.Currency
                    type="INPUT"
                    className="p-3"
                    loading={false}
                    value={input0}
                    onChange={onInput0}
                    onSelect={onSelectToken0}
                    currency={token0}
                    chainId={chainId}
                  />
                  <div className="flex items-center justify-center -mt-[12px] -mb-[12px] z-10">
                    <div className="group dark:bg-slate-700 p-0.5 dark:border-2 dark:border-slate-800 transition-all rounded-full">
                      <PlusIcon width={16} height={16} />
                    </div>
                  </div>
                  <div className="dark:bg-slate-800 bg-white">
                    <Web3Input.Currency
                      type="INPUT"
                      className="p-3 !pb-1"
                      value={input1}
                      onChange={onInput1}
                      currency={token1}
                      onSelect={onSelectToken1}
                      chainId={chainId}
                    />
                    <div className="p-3">{children}</div>
                  </div>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </Widget.Content>
    </Widget>
  )
}
