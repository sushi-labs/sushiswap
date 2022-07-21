import { Disclosure, Transition } from '@headlessui/react'
import { ChevronRightIcon, InformationCircleIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { useIsMounted } from '@sushiswap/hooks'
import { GasPrice } from '@sushiswap/redux-localstorage'
import { classNames, DEFAULT_INPUT_UNSTYLED, GasIcon, Input, Popover, Tab, Typography } from '@sushiswap/ui'
import { FC } from 'react'
import { useFeeData } from 'wagmi'

import { useSettings } from '../../lib/state/storage'

interface GasSettingsDisclosure {
  chainId: ChainId | undefined
}

const gasPriceToIndex: Record<GasPrice, number> = {
  [GasPrice.LOW]: 3,
  [GasPrice.MEDIUM]: 2,
  [GasPrice.HIGH]: 1,
  [GasPrice.INSTANT]: 0,
}

const gasIndexToPrice: Record<number, GasPrice> = {
  0: GasPrice.INSTANT,
  1: GasPrice.HIGH,
  2: GasPrice.MEDIUM,
  3: GasPrice.LOW,
}

export const GasSettingsDisclosure: FC<GasSettingsDisclosure> = ({ chainId }) => {
  const isMounted = useIsMounted()
  const { data } = useFeeData({
    formatUnits: 'gwei',
    chainId,
    watch: true,
  })

  const [
    { gasPrice, gasType, maxPriorityFeePerGas, maxFeePerGas },
    { updateGasPrice, updateGasType, updateMaxPriorityFeePerGas, updateMaxFeePerGas },
  ] = useSettings()

  const currentGas =
    data &&
    (
      Number(data.formatted.gasPrice) *
      (gasPrice === GasPrice.LOW ? 0.75 : gasPrice === GasPrice.MEDIUM ? 1 : gasPrice === GasPrice.HIGH ? 1.5 : 2)
    ).toFixed(1)

  if (!isMounted) return <></>

  return (
    <Disclosure>
      {({ open }) => (
        <div className="border-b border-slate-200/5">
          <Disclosure.Button className="relative flex items-center justify-between w-full gap-3 group rounded-xl">
            <div className="flex items-center justify-center w-5 h-5">
              <GasIcon width={18} height={18} className="text-slate-500" />
            </div>
            <div className="flex items-center justify-between w-full gap-1 py-4">
              <Typography variant="sm" weight={500}>
                Gas Price
              </Typography>
              <div className="flex gap-1">
                <Typography variant="sm" weight={500} className="group-hover:text-slate-200 text-slate-400">
                  {gasType == 'preset' ? `${gasPrice} (${currentGas} Gwei)` : 'Custom'}
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
                selectedIndex={gasType === 'preset' ? 0 : 1}
                onChange={(index) => updateGasType(index === 0 ? 'preset' : 'custom')}
              >
                <Tab.List>
                  <Tab>Basic Setting</Tab>
                  <Tab>Advanced</Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    <Tab.Group
                      selectedIndex={gasPriceToIndex[gasPrice]}
                      onChange={(index) => updateGasPrice(gasIndexToPrice[index])}
                    >
                      <Tab.List className="mt-2">
                        <Tab as="div" className="!h-[unset] p-2" v>
                          <div className="flex flex-col gap-0.5">
                            <Typography variant="xs" weight={500} className="text-slate-400">
                              Instant
                            </Typography>
                            <Typography variant="sm" weight={700} className="text-slate-200">
                              {data && (Number(data.formatted.gasPrice) * 2).toFixed(1)} Gwei
                            </Typography>
                            <Typography variant="xxs" weight={500} className="text-slate-400">
                              {'< 5 Sec'}
                            </Typography>
                          </div>
                        </Tab>
                        <Tab as="div" className="!h-[unset] p-2">
                          <div className="flex flex-col gap-0.5">
                            <Typography variant="xs" weight={500} className="text-slate-400">
                              Fast
                            </Typography>
                            <Typography variant="sm" weight={700} className="text-slate-200">
                              {data && (Number(data.formatted.gasPrice) * 1.5).toFixed(1)} Gwei
                            </Typography>
                            <Typography variant="xxs" weight={500} className="text-slate-400">
                              {'< 30 Sec'}
                            </Typography>
                          </div>
                        </Tab>
                        <Tab as="div" className="!h-[unset] p-2">
                          <div className="flex flex-col gap-0.5">
                            <Typography variant="xs" weight={500} className="text-slate-400">
                              Standard
                            </Typography>
                            <Typography variant="sm" weight={700} className="text-slate-200">
                              {data && (Number(data.formatted.gasPrice) * 1).toFixed(1)} Gwei
                            </Typography>
                            <Typography variant="xxs" weight={500} className="text-slate-400">
                              {'2 - 3 Min'}
                            </Typography>
                          </div>
                        </Tab>
                        <Tab as="div" className="!h-[unset] p-2">
                          <div className="flex flex-col gap-0.5">
                            <Typography variant="xs" weight={500} className="text-slate-400">
                              Slow
                            </Typography>
                            <Typography variant="sm" weight={700} className="text-slate-200">
                              {data && (Number(data.formatted.gasPrice) * 0.75).toFixed(1)} Gwei
                            </Typography>
                            <Typography variant="xxs" weight={500} className="text-slate-400">
                              {'> 5 min'}
                            </Typography>
                          </div>
                        </Tab>
                      </Tab.List>
                    </Tab.Group>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div className="flex gap-1 mt-2">
                      <div className="flex flex-col gap-2 px-3 py-2 bg-slate-900 rounded-xl">
                        <Typography variant="xs" weight={700} className="flex items-center gap-1 text-slate-300">
                          Max Fee
                          <Popover
                            tabIndex={-1}
                            hover
                            button={<InformationCircleIcon width={14} height={14} />}
                            panel={
                              <div className="bg-slate-600 !rounded-lg w-40 flex flex-col gap-2 p-3">
                                <Typography variant="xs" weight={700}>
                                  The max fee is the utmost amount of gas a user can pay for their transaction; you will
                                  not pay more.
                                </Typography>
                                <Typography variant="xs" weight={700}>
                                  It&apos;s calculated as the sum of the base fee and priority fee.
                                </Typography>
                              </div>
                            }
                          />
                        </Typography>
                        <div className="flex items-center gap-2">
                          <Input.Numeric
                            variant="unstyled"
                            value={maxFeePerGas ?? ''}
                            onUserInput={(val) => updateMaxFeePerGas(val)}
                            placeholder={data?.formatted.maxFeePerGas || ''}
                            className={classNames(DEFAULT_INPUT_UNSTYLED, '')}
                          />
                          <Typography variant="xs" weight={700} className="text-slate-400">
                            Gwei
                          </Typography>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 px-3 py-2 bg-slate-900 rounded-xl">
                        <Typography variant="xs" weight={700} className="flex items-center gap-1 text-slate-300">
                          Max Priority Fee
                          <Popover
                            tabIndex={-1}
                            hover
                            button={<InformationCircleIcon width={14} height={14} />}
                            panel={
                              <Typography variant="xs" weight={700} className="bg-slate-600 !rounded-lg w-40 p-3">
                                This fee can be seen as an extra “tip” to miners, incentivizing them to prioritize your
                                transaction
                              </Typography>
                            }
                          />
                        </Typography>
                        <div className="flex items-center gap-2">
                          <Input.Numeric
                            variant="unstyled"
                            value={maxPriorityFeePerGas ?? ''}
                            onUserInput={(val) => updateMaxPriorityFeePerGas(val)}
                            placeholder={data?.formatted.maxPriorityFeePerGas || ''}
                            className={classNames(DEFAULT_INPUT_UNSTYLED, '')}
                          />
                          <Typography variant="xs" weight={700} className="text-slate-400">
                            Gwei
                          </Typography>
                        </div>
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
