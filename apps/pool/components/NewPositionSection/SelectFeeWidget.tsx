import { Disclosure, Transition } from '@headlessui/react'
import { ChainId } from '@sushiswap/chain'
import { Fee } from '@sushiswap/exchange'
import { Tab, Tooltip, Typography } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import React, { FC } from 'react'

import { TRIDENT_ENABLED_NETWORKS } from '../../config'

interface SelectFeeWidgetProps {
  selectedNetwork: ChainId
  fee: number
  setFee(fee: number): void
}

export const FEE_MAP = [Fee.LOW, Fee.MEDIUM, Fee.DEFAULT, Fee.HIGH]

export const SelectFeeWidget: FC<SelectFeeWidgetProps> = ({ selectedNetwork, fee, setFee }) => {
  return (
    <Widget id="selectFee" maxWidth={400} className="bg-slate-800">
      <Widget.Content>
        <Disclosure>
          {() => (
            <>
              {!TRIDENT_ENABLED_NETWORKS.includes(selectedNetwork) ? (
                <Tooltip
                  mouseEnterDelay={0.3}
                  button={
                    <div className="flex justify-between items-center pr-3">
                      <Widget.Header title="2. Select Fee Tier" className="!pb-3" />
                      <Typography variant="sm" weight={700} className="px-2 py-1 rounded-lg bg-slate-900">
                        {(FEE_MAP[fee] / 100).toFixed(2)}%
                      </Typography>
                    </div>
                  }
                  panel={
                    <Typography variant="xs" className="max-w-[220px]">
                      This network does not allow changing the default fee of 0.3%
                    </Typography>
                  }
                ></Tooltip>
              ) : (
                <Disclosure.Button className="w-full pr-3">
                  <div className="flex justify-between items-center">
                    <Widget.Header title="2. Select Fee Tier" className="!pb-3" />
                    <Typography variant="sm" weight={700} className="px-2 py-1 rounded-lg bg-slate-900">
                      {(FEE_MAP[fee] / 100).toFixed(2)}%
                    </Typography>
                  </div>
                </Disclosure.Button>
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
                  <div className="p-3 pt-0">
                    <Tab.Group selectedIndex={fee} onChange={setFee}>
                      <Tab.List className="mt-2">
                        <Disclosure.Button>
                          <Tab as="div" className="!h-[unset] p-2">
                            <div className="flex flex-col gap-0.5">
                              <Typography variant="xs" weight={500} className="text-slate-200">
                                0.01%
                              </Typography>
                              <Typography variant="xxs" weight={500} className="text-slate-400">
                                Best for stable pairs.
                              </Typography>
                            </div>
                          </Tab>
                        </Disclosure.Button>
                        <Disclosure.Button>
                          <Tab as="div" className="!h-[unset] p-2">
                            <div className="flex flex-col gap-0.5">
                              <Typography variant="xs" weight={500} className="text-slate-200">
                                0.05%
                              </Typography>
                              <Typography variant="xxs" weight={500} className="text-slate-400">
                                Best for less volatile pairs.
                              </Typography>
                            </div>
                          </Tab>
                        </Disclosure.Button>
                        <Disclosure.Button>
                          <Tab as="div" className="!h-[unset] p-2">
                            <div className="flex flex-col gap-0.5">
                              <Typography variant="xs" weight={500} className="text-slate-200">
                                0.3%
                              </Typography>
                              <Typography variant="xxs" weight={500} className="text-slate-400">
                                Best for most pairs.
                              </Typography>
                            </div>
                          </Tab>
                        </Disclosure.Button>
                        <Disclosure.Button>
                          <Tab as="div" className="!h-[unset] p-2">
                            <div className="flex flex-col gap-0.5">
                              <Typography variant="xs" weight={500} className="text-slate-200">
                                1%
                              </Typography>
                              <Typography variant="xxs" weight={500} className="text-slate-400">
                                Best for volatile pairs.
                              </Typography>
                            </div>
                          </Tab>
                        </Disclosure.Button>
                      </Tab.List>
                    </Tab.Group>
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
