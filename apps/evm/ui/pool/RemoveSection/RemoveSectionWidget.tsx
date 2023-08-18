import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon, CogIcon } from '@heroicons/react-v1/outline'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native, Type } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { classNames } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Currency as UICurrency } from '@sushiswap/ui/components/currency'
import { IconButton } from '@sushiswap/ui/components/iconbutton'
import { Input } from '@sushiswap/ui/components/input'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/components/settings'
import { Widget, WidgetContent, WidgetHeader } from '@sushiswap/ui/components/widget'
import { useAccount } from '@sushiswap/wagmi'
import React, { FC, Fragment, ReactNode, useState } from 'react'

import { usePoolPosition } from '../PoolPositionProvider'

interface RemoveSectionWidgetProps {
  isFarm: boolean
  chainId: ChainId
  percentage: string
  token0: Type
  token1: Type
  token0Minimum?: Amount<Type>
  token1Minimum?: Amount<Type>
  setPercentage(percentage: string): void
  children: ReactNode
}

export const RemoveSectionWidget: FC<RemoveSectionWidgetProps> = ({
  isFarm,
  chainId,
  percentage,
  setPercentage,
  token0,
  token1,
  token0Minimum,
  token1Minimum,
  children,
}) => {
  const isMounted = useIsMounted()
  const [hover, setHover] = useState(false)
  const { address } = useAccount()
  const { balance, value0, value1 } = usePoolPosition()

  return (
    <div className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Transition
        show={Boolean(hover && !balance?.[FundSource.WALLET]?.greaterThan(ZERO) && address)}
        as={Fragment}
        enter="transition duration-300 origin-center ease-out"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
      >
        <div className="border border-slate-200/5 flex justify-center items-center z-[100] absolute inset-0 backdrop-blur bg-black bg-opacity-[0.24] rounded-2xl">
          <p className="text-xs font-semibold  bg-white bg-opacity-[0.12] rounded-full p-2 px-3">
            No liquidity tokens found {isFarm && ', did you unstake?'}
          </p>
        </div>
      </Transition>
      <Widget id="removeLiquidity" maxWidth="sm" className="bg-white dark:bg-slate-800">
        <WidgetContent>
          <Disclosure defaultOpen={true}>
            {({ open }) => (
              <>
                {isFarm && isMounted ? (
                  <WidgetHeader title="Remove Liquidity">
                    <div className="flex gap-2">
                      <SettingsOverlay
                        options={{
                          slippageTolerance: {
                            storageKey: 'removeLiquidity',
                            defaultValue: '0.5',
                            title: 'Remove Liquidity Slippage',
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
                  <WidgetHeader title="Remove Liquidity">
                    <div className="flex gap-3">
                      <SettingsOverlay
                        options={{
                          slippageTolerance: {
                            storageKey: 'removeLiquidity',
                            defaultValue: '0.5',
                            title: 'Remove Liquidity Slippage',
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
                      </SettingsOverlay>{' '}
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
                  <Disclosure.Panel unmount={false}>
                    <div className="flex flex-col gap-3 pt-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-between flex-grow">
                          <Input.Percent
                            id="amount"
                            label="Amount"
                            onUserInput={(val) => setPercentage(val ? Math.min(+val, 100).toString() : '')}
                            value={percentage}
                            placeholder="100%"
                            variant="unstyled"
                            className={classNames(
                              'p-0 bg-transparent border-none focus:outline-none focus:ring-0 w-full truncate font-medium text-left text-base md:text-sm placeholder:font-normal font-medium',
                              '!text-2xl'
                            )}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="xs"
                            variant={percentage === '25' ? 'default' : 'secondary'}
                            onClick={() => setPercentage('25')}
                            testId="remove-liquidity-25"
                          >
                            25%
                          </Button>
                          <Button
                            size="xs"
                            variant={percentage === '50' ? 'default' : 'secondary'}
                            onClick={() => setPercentage('50')}
                            testId="remove-liquidity-50"
                          >
                            50%
                          </Button>
                          <Button
                            size="xs"
                            variant={percentage === '75' ? 'default' : 'secondary'}
                            onClick={() => setPercentage('75')}
                            testId="remove-liquidity-75"
                          >
                            75%
                          </Button>
                          <Button
                            size="xs"
                            variant={percentage === '100' ? 'default' : 'secondary'}
                            onClick={() => setPercentage('100')}
                            testId="remove-liquidity-max"
                          >
                            MAX
                          </Button>
                        </div>
                      </div>
                      <div className="grid items-center justify-between grid-cols-2 pb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-slate-300">
                          {formatUSD((value0 + value1) * (+percentage / 100))}
                        </span>
                        <div className="flex justify-end">
                          <Button size="sm" variant="link" testId="stake-balance" onClick={() => setPercentage('100')}>
                            Balance: {balance?.[FundSource.WALLET].toSignificant(6)}
                          </Button>
                        </div>
                      </div>
                      <Transition
                        show={Boolean(+percentage > 0 && token0Minimum && token1Minimum)}
                        unmount={false}
                        className="transition-[max-height] overflow-hidden"
                        enter="duration-300 ease-in-out"
                        enterFrom="transform max-h-0"
                        enterTo="transform max-h-[380px]"
                        leave="transition-[max-height] duration-250 ease-in-out"
                        leaveFrom="transform max-h-[380px]"
                        leaveTo="transform max-h-0"
                      >
                        <div className="flex flex-col gap-3 py-3 pt-5 border-t border-slate-200/5">
                          <p className="text-sm pb-1 text-gray-600 dark:text-slate-400">
                            You&apos;ll receive at least:
                          </p>

                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium flex items-center gap-2 text-gray-900 dark:text-slate-50">
                              {token0 && <UICurrency.Icon currency={token0} width={20} height={20} />}
                              <span className="text-gray-600 dark:text-slate-400">
                                <span className="text-gray-900 dark:text-slate-50">
                                  {token0Minimum?.toSignificant(6)}
                                </span>{' '}
                                {Native.onChain(chainId).wrapped.address === token0.wrapped.address
                                  ? Native.onChain(chainId).symbol
                                  : token0Minimum?.currency.symbol}
                              </span>
                            </p>
                            <p className="text-xs text-gray-600 dark:text-slate-400">
                              {formatUSD(value0 * (+percentage / 100))}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium flex items-center gap-2 text-gray-900 dark:text-slate-50">
                              {token1 && <UICurrency.Icon currency={token1} width={20} height={20} />}
                              <span className="text-gray-600 dark:text-slate-400">
                                <span className="text-gray-900 dark:text-slate-50">
                                  {token1Minimum?.toSignificant(6)}
                                </span>{' '}
                                {Native.onChain(chainId).wrapped.address === token1.wrapped.address
                                  ? Native.onChain(chainId).symbol
                                  : token1Minimum?.currency.symbol}
                              </span>
                            </p>
                            <p className="text-xs text-gray-600 dark:text-slate-400">
                              {formatUSD(value1 * (+percentage / 100))}
                            </p>
                          </div>
                        </div>
                      </Transition>
                      {children}
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        </WidgetContent>
      </Widget>
    </div>
  )
}
