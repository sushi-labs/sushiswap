import { Disclosure, Transition } from '@headlessui/react'
import { ChainId } from '@sushiswap/chain'
import { Tab, Tooltip, Typography } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import { PoolFinderType } from '@sushiswap/wagmi'
import React, { FC, memo } from 'react'

import { TRIDENT_ENABLED_NETWORKS } from '../../config'

interface SelectPoolTypeWidgetProps {
  selectedNetwork: ChainId
  poolType: PoolFinderType
  setPoolType(type: PoolFinderType): void
}

export const SelectPoolTypeWidget: FC<SelectPoolTypeWidgetProps> = memo(
  ({ selectedNetwork, poolType, setPoolType }) => {
    return (
      <Widget id="selectPoolType" maxWidth={400} className="!bg-slate-800">
        <Widget.Content>
          <Disclosure>
            {() => (
              <>
                {!TRIDENT_ENABLED_NETWORKS.includes(selectedNetwork) ? (
                  <Tooltip
                    mouseEnterDelay={0.3}
                    button={
                      <div className="flex items-center justify-between pr-3">
                        <Widget.Header title="2. Select Type" className="!pb-3" />
                        <Typography variant="sm" weight={700} className="px-2 py-1 rounded-lg bg-slate-900">
                          Classic
                        </Typography>
                      </div>
                    }
                    panel={
                      <Typography variant="xs" className="max-w-[220px]">
                        This network does not allow changing the default pool type
                      </Typography>
                    }
                  ></Tooltip>
                ) : (
                  <Disclosure.Button className="w-full pr-3">
                    <div className="flex items-center justify-between">
                      <Widget.Header title="2. Select Type" className="!pb-3" />
                      <Typography variant="sm" weight={700} className="px-2 py-1 rounded-lg bg-slate-900">
                        {PoolFinderType[poolType]}
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
                      <Tab.Group selectedIndex={poolType} onChange={setPoolType}>
                        <Tab.List className="grid grid-cols-2 mt-2">
                          <Disclosure.Button className="hidden">
                            <Tab as="div" className="!h-[unset] p-2">
                              <div className="flex flex-col gap-0.5">
                                <Typography variant="xs" weight={500} className="text-slate-200">
                                  Classic
                                </Typography>
                                <Typography variant="xxs" weight={500} className="text-slate-400">
                                  Suitable for volatile pairs
                                </Typography>
                              </div>
                            </Tab>
                          </Disclosure.Button>
                          <Disclosure.Button>
                            <Tab as="div" className="!h-[unset] p-2">
                              <div className="flex flex-col gap-0.5">
                                <Typography variant="xs" weight={500} className="text-slate-200">
                                  Constant Product
                                </Typography>
                                <Typography variant="xxs" weight={500} className="text-slate-400">
                                  Suitable for volatile pairs
                                </Typography>
                              </div>
                            </Tab>
                          </Disclosure.Button>
                          <Disclosure.Button>
                            <Tab as="div" className="!h-[unset] p-2">
                              <div className="flex flex-col gap-0.5 ">
                                <Typography variant="xs" weight={500} className="text-slate-200">
                                  Stable
                                </Typography>
                                <Typography variant="xxs" weight={500} className="text-slate-400">
                                  Suitable for stable pairs
                                </Typography>
                              </div>
                            </Tab>
                          </Disclosure.Button>
                          {/* <Disclosure.Button>
                            <Tab as="div" className="!h-[unset] p-2">
                              <div className="flex flex-col gap-0.5">
                                <Typography variant="xs" weight={500} className="text-slate-200">
                                  Concentrated
                                </Typography>
                                <Typography variant="xxs" weight={500} className="text-slate-400">
                                  ...
                                </Typography>
                              </div>
                            </Tab>
                          </Disclosure.Button> */}
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
)
