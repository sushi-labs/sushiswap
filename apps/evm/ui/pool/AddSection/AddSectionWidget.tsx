import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon, CogIcon } from '@heroicons/react-v1/outline'
import { PlusIcon } from '@heroicons/react-v1/solid'
import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { useIsMounted } from '@sushiswap/hooks'
import { IconButton } from '@sushiswap/ui/components/iconbutton'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/components/settings'
import { Widget, WidgetContent, WidgetHeader } from '@sushiswap/ui/components/widget'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import React, { FC, Fragment, ReactNode } from 'react'

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
    <Widget id="addLiquidity" maxWidth="sm">
      <WidgetContent>
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <>
              {isFarm && isMounted ? (
                <WidgetHeader title="1. Add Liquidity">
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
                        <IconButton
                          size="sm"
                          name="Settings"
                          icon={CogIcon}
                          variant="secondary"
                          onClick={() => setOpen(true)}
                        />
                      )}
                    </SettingsOverlay>
                    <Disclosure.Button as={Fragment}>
                      <IconButton size="sm" icon={ChevronDownIcon} name="Select" />
                    </Disclosure.Button>
                  </div>
                </WidgetHeader>
              ) : (
                <WidgetHeader title="Add Liquidity">
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
                        <IconButton
                          size="sm"
                          name="Settings"
                          icon={CogIcon}
                          variant="secondary"
                          onClick={() => setOpen(true)}
                        />
                      )}
                    </SettingsOverlay>
                  </div>
                </WidgetHeader>
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
                <Disclosure.Panel unmount={false} className="pt-4">
                  <Web3Input.Currency
                    type="INPUT"
                    className="bg-muted p-3 !rounded-xl"
                    loading={false}
                    value={input0}
                    onChange={onInput0}
                    onSelect={onSelectToken0}
                    currency={token0}
                    chainId={chainId}
                  />
                  <div className="flex items-center justify-center -mt-[8px] -mb-[8px] z-10">
                    <div className="group p-0.5 bg-accent rounded-full">
                      <PlusIcon width={16} height={16} />
                    </div>
                  </div>
                  <Web3Input.Currency
                    type="INPUT"
                    className="bg-muted p-3 !rounded-xl"
                    value={input1}
                    onChange={onInput1}
                    currency={token1}
                    onSelect={onSelectToken1}
                    chainId={chainId}
                  />
                  <div className="pt-4">{children}</div>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </WidgetContent>
    </Widget>
  )
}
