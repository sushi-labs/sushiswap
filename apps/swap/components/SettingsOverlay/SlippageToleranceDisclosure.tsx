import { Disclosure, Transition } from '@headlessui/react'
import { AdjustmentsIcon, ChevronRightIcon, InformationCircleIcon } from '@heroicons/react/outline'
import { classNames, DEFAULT_INPUT_UNSTYLED, Input, Popover, Tab, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { useSettings } from '../../lib/state/storage'

export const SlippageToleranceDisclosure: FC = () => {
  const [{ slippageTolerance, slippageToleranceType }, { updateSlippageTolerance, updateSlippageToleranceType }] =
    useSettings()

  return (
    <Disclosure>
      {({ open }) => (
        <div className="border-b border-slate-200/5">
          <Disclosure.Button
            as="div"
            className="relative flex items-center justify-between w-full gap-3 group rounded-xl"
          >
            <div className="flex items-center justify-center w-5 h-5">
              <AdjustmentsIcon width={20} height={20} className="-ml-0.5 text-slate-500" />
            </div>
            <div className="flex items-center justify-between w-full gap-1 py-4">
              <div className="flex items-center gap-1">
                <Typography variant="sm" weight={500}>
                  Slippage Tolerance
                </Typography>
                <Popover
                  tabIndex={-1}
                  hover
                  button={<InformationCircleIcon width={14} height={14} />}
                  panel={
                    <div className="bg-slate-600 !rounded-lg w-40 flex flex-col gap-2 p-3">
                      <Typography variant="xs" weight={500}>
                        Slippage tolerance is the utmost percentage of slippage a user is willing to execute a trade
                        with; if the actual slippage falls outside of the user-designated range, the transaction will
                        revert. Slippage is the difference between the expected value of output from a trade and the
                        actual value due to asset volatility and liquidity depth.
                      </Typography>
                    </div>
                  }
                />
              </div>
              <div className="flex gap-1">
                <Typography variant="sm" weight={500} className="group-hover:text-slate-200 text-slate-400">
                  {slippageToleranceType === 'auto' ? 'Auto' : `Custom (${slippageTolerance}%)`}
                </Typography>
                <div
                  className={classNames(
                    open ? 'rotate-90' : 'rotate-0',
                    'transition-all w-5 h-5 -mr-1.5 flex items-center delay-300'
                  )}
                >
                  <ChevronRightIcon width={16} height={16} className="group-hover:text-slate-200 text-slate-300" />
                </div>
              </div>
            </div>
          </Disclosure.Button>

          <Transition
            unmount={false}
            className="transition-[max-height] overflow-hidden mb-3"
            enter="duration-300 ease-in-out"
            enterFrom="transform max-h-0"
            enterTo="transform max-h-[380px]"
            leave="transition-[max-height] duration-250 ease-in-out"
            leaveFrom="transform max-h-[380px]"
            leaveTo="transform max-h-0"
          >
            <Disclosure.Panel>
              <Tab.Group
                selectedIndex={slippageToleranceType === 'auto' ? 0 : 1}
                onChange={(index) => updateSlippageToleranceType(index === 0 ? 'auto' : 'custom')}
              >
                <Tab.List>
                  <Tab>Auto</Tab>
                  <Tab>Custom</Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel />
                  <Tab.Panel>
                    <div className="mt-2 flex flex-col gap-2 px-3 py-2 bg-slate-900 rounded-xl">
                      <Typography variant="xs" weight={500} className="flex items-center gap-1 text-slate-300">
                        Custom Slippage
                        <Popover
                          tabIndex={-1}
                          hover
                          button={<InformationCircleIcon width={14} height={14} />}
                          panel={
                            <div className="bg-slate-600 !rounded-lg w-40 flex flex-col gap-2 p-3">
                              <Typography variant="xs" weight={500}>
                                Slippage tolerance is the utmost percentage of slippage a user is willing to execute a
                                trade with; if the actual slippage falls outside of the user-designated range, the
                                transaction will revert. Slippage is the difference between the expected value of output
                                from a trade and the actual value due to asset volatility and liquidity depth.
                              </Typography>
                            </div>
                          }
                        />
                      </Typography>
                      <div className="flex items-center gap-2">
                        <Input.Numeric
                          variant="unstyled"
                          value={slippageTolerance ?? ''}
                          onUserInput={(val) => updateSlippageTolerance(+val)}
                          placeholder="1"
                          className={classNames(DEFAULT_INPUT_UNSTYLED, '')}
                        />
                        <Typography variant="xs" weight={500} className="text-slate-400">
                          %
                        </Typography>
                      </div>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  )
}
