import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon, CogIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native, Type } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { classNames, DEFAULT_INPUT_UNSTYLED, Input, Typography } from '@sushiswap/ui'
import { Widget, WidgetHeader, WidgetContent } from '@sushiswap/ui/future/components/widget'
import React, { FC, Fragment, ReactNode, useState } from 'react'
import { useAccount } from '@sushiswap/wagmi'
import { Currency as UICurrency } from '@sushiswap/ui/future/components/currency'

import { usePoolPosition } from '../PoolPositionProvider'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/future/components/settings'
import { Button } from '@sushiswap/ui/future/components/button'
import { AppearOnMount } from '@sushiswap/ui/future/components/animation'

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
          <Typography variant="xs" weight={600} className="bg-white bg-opacity-[0.12] rounded-full p-2 px-3">
            No liquidity tokens found {isFarm && ', did you unstake?'}
          </Typography>
        </div>
      </Transition>
      <Widget id="removeLiquidity" maxWidth="sm" className="bg-white dark:bg-slate-800">
        <WidgetContent>
          <Disclosure defaultOpen={true}>
            {({ open }) => (
              <>
                {isFarm && isMounted ? (
                  <WidgetHeader title="Remove Liquidity" className="!pb-3 ">
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
                  </WidgetHeader>
                ) : (
                  <WidgetHeader title="Remove Liquidity" className="!pb-3 ">
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
                    <div className="flex flex-col gap-3 p-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-between flex-grow">
                          <Input.Percent
                            onUserInput={(val) => setPercentage(val ? Math.min(+val, 100).toString() : '')}
                            value={percentage}
                            placeholder="100%"
                            variant="unstyled"
                            className={classNames(DEFAULT_INPUT_UNSTYLED, '!text-2xl')}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="xs"
                            onClick={() => setPercentage('25')}
                            testdata-id="remove-liquidity-25-button"
                          >
                            25%
                          </Button>
                          <Button
                            size="xs"
                            onClick={() => setPercentage('50')}
                            testdata-id="remove-liquidity-50-button"
                          >
                            50%
                          </Button>
                          <Button
                            size="xs"
                            onClick={() => setPercentage('75')}
                            testdata-id="remove-liquidity-75-button"
                          >
                            75%
                          </Button>
                          <Button
                            size="xs"
                            onClick={() => setPercentage('100')}
                            testdata-id="remove-liquidity-max-button"
                          >
                            MAX
                          </Button>
                        </div>
                      </div>
                      <div className="grid items-center justify-between grid-cols-3 pb-2">
                        <AppearOnMount show={Boolean(balance?.[FundSource.WALLET])}>
                          <Typography variant="sm" weight={500} className="text-gray-900 dark:text-slate-300">
                            {formatUSD((value0 + value1) * (+percentage / 100))}
                          </Typography>
                        </AppearOnMount>
                        <AppearOnMount
                          className="flex justify-end col-span-2"
                          show={Boolean(balance?.[FundSource.WALLET])}
                        >
                          <Typography
                            onClick={() => setPercentage('100')}
                            as="button"
                            variant="sm"
                            weight={500}
                            className="text-gray-700 truncate hover:text-gray-800 dark:text-slate-300 dark:hover:text-slate-200"
                          >
                            Balance: {balance?.[FundSource.WALLET].toSignificant(6)}
                          </Typography>
                        </AppearOnMount>
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
                          <Typography variant="sm" weight={400} className="pb-1 text-gray-600 dark:text-slate-400">
                            You&apos;ll receive at least:
                          </Typography>

                          <div className="flex items-center justify-between">
                            <Typography
                              variant="sm"
                              weight={500}
                              className="flex items-center gap-2 text-gray-900 dark:text-slate-50"
                            >
                              {token0 && <UICurrency.Icon currency={token0} width={20} height={20} />}
                              <span className="text-gray-600 dark:text-slate-400">
                                <span className="text-gray-900 dark:text-slate-50">
                                  {token0Minimum?.toSignificant(6)}
                                </span>{' '}
                                {Native.onChain(chainId).wrapped.address === token0.wrapped.address
                                  ? Native.onChain(chainId).symbol
                                  : token0Minimum?.currency.symbol}
                              </span>
                            </Typography>
                            <Typography variant="xs" className="text-gray-600 dark:text-slate-400">
                              {formatUSD(value0 * (+percentage / 100))}
                            </Typography>
                          </div>
                          <div className="flex items-center justify-between">
                            <Typography
                              variant="sm"
                              weight={500}
                              className="flex items-center gap-2 text-gray-900 dark:text-slate-50"
                            >
                              {token1 && <UICurrency.Icon currency={token1} width={20} height={20} />}
                              <span className="text-gray-600 dark:text-slate-400">
                                <span className="text-gray-900 dark:text-slate-50">
                                  {token1Minimum?.toSignificant(6)}
                                </span>{' '}
                                {Native.onChain(chainId).wrapped.address === token1.wrapped.address
                                  ? Native.onChain(chainId).symbol
                                  : token1Minimum?.currency.symbol}
                              </span>
                            </Typography>
                            <Typography variant="xs" className="text-gray-600 dark:text-slate-400">
                              {formatUSD(value1 * (+percentage / 100))}
                            </Typography>
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
