import { Popover, Tab, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { classNames } from '@sushiswap/ui'
import React, { FC, Fragment, useState } from 'react'
import { useUserStreams, useUserVestings } from '../lib'
import { Button } from '@sushiswap/ui/future/components/button'
import { SushiIcon } from '@sushiswap/ui/future/components/icons'
import Container from '@sushiswap/ui/future/components/Container'
import { List } from '@sushiswap/ui/future/components/list/List'
import { useAccount } from 'wagmi'
import { FuroTableType, StreamTable } from './Table'
import { Address } from '@wagmi/core'

export const Dashboard: FC<{ address?: Address }> = ({ address: providedAddress }) => {
  const { address: account } = useAccount()
  const address = providedAddress ? providedAddress : account

  const [showActiveIncoming, setShowActiveIncoming] = useState(false)

  const { data: streams, isLoading: isStreamsLoading } = useUserStreams({ account: address })
  const { data: vestings, isLoading: isVestingsLoading } = useUserVestings({ account: address })

  const isLoading = isStreamsLoading || isVestingsLoading

  return (
    <div className="flex flex-col gap-10">
      <Container maxWidth="6xl" className="mx-auto px-4 pt-[80px] lg:pb-[54px]">
        <section className="flex flex-col gap-12 justify-between">
          <div className="flex flex-col flex-grow gap-6 items-center lg:items-start">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex flex-col gap-5">
                <h1 className="text-5xl font-semibold leading-[1.1] mt-2">
                  Want to stream
                  <br /> to someone?
                </h1>
                <span className="text-2xl text-slate-400 leading-[1.5]">
                  Sushi Pay allows you to stream any ERC20 to any wallet.
                </span>
                <div className="group relative z-10 mt-2">
                  <div className="flex w-full items-center">
                    <Button variant="filled" className="text-blue font-medium rounded-l-full" size="lg">
                      Pay Someone
                    </Button>
                    <Popover as={Fragment}>
                      {({ open }) => (
                        <>
                          <Popover.Button
                            as="button"
                            className={classNames(
                              open ? 'bg-blue-600' : '',
                              'bg-blue hover:bg-blue-600 h-[44px] w-[44px] flex items-center justify-center rounded-r-full text-white'
                            )}
                          >
                            <ChevronDownIcon width={24} height={24} />
                          </Popover.Button>
                          <Transition
                            show={open}
                            enter="transition duration-300 ease-out"
                            enterFrom="transform translate-y-[-16px] scale-[0.95]"
                            enterTo="transform translate-y-0 scale-[1]"
                            leave="transition duration-300 ease-out"
                            leaveFrom="transform translate-y-0 opacity-100 scale-[1]"
                            leaveTo="transform translate-y-[-16px] opacity-0 scale-[0.95]"
                          >
                            <div className={classNames('right-[-140px] absolute pt-3 top-4 w-[320px]')}>
                              <div className="p-2 flex flex-col w-full right-0 absolute rounded-2xl shadow-md bg-white/50 paper dark:bg-slate-800/50">
                                <Popover.Panel>
                                  <List.MenuItem
                                    as="a"
                                    href={`/stream/create`}
                                    title="New Stream"
                                    subtitle={'Most efficient way of providing liquidity.'}
                                  />
                                  <List.MenuItem
                                    as="a"
                                    href={`/vesting/create`}
                                    title="New Vesting"
                                    subtitle={'If you prefer creating a classic liquidity position.'}
                                  >
                                    New Vesting
                                  </List.MenuItem>
                                </Popover.Panel>
                              </div>
                            </div>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="shadow-lg relative w-[460px] h-[290px] bg-gradient-to-tr from-blue to-pink flex flex-col bg-slate-800 p-4 rounded-2xl">
                  <span className="flex items-center justify-start gap-2">
                    <div className="flex flex-col">
                      <span className="font-medium text-white">SUSHI</span>
                      <span className="text-2xl font-medium text-white">5000</span>
                    </div>
                  </span>
                  <div className="absolute bottom-4 right-4 flex gap-3 items-center justify-center">
                    <div className="bg-white/10 p-2 rounded-full shadow-md">
                      <SushiIcon width={22} height={22} />
                    </div>
                    <span className="text-2xl font-medium tracking-[-0.025em] text-white">
                      Sushi <span className="font-bold">Pay</span>
                    </span>
                  </div>
                  <div className="absolute left-5 bottom-4 text-lg font-semibold text-sh tracking-wide mono flex flex-col text-white">
                    <span className="text-sm font-medium">Recipient</span>
                    you.eth
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
      <Container maxWidth="6xl" className="mx-auto px-4 mb-[120px]">
        <Tab.Group>
          <div className="flex items-center gap-2 mb-4">
            <Tab as={Fragment}>
              {({ selected }) => (
                <Button size="sm" variant={selected ? 'outlined' : 'empty'} color="default">
                  Incoming
                </Button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <Button size="sm" variant={selected ? 'outlined' : 'empty'} color="default">
                  Outgoing
                </Button>
              )}
            </Tab>
            <Button
              variant={showActiveIncoming ? 'outlined' : 'empty'}
              color={showActiveIncoming ? 'blue' : 'default'}
              onClick={() => setShowActiveIncoming((prevState) => !prevState)}
              size="sm"
            >
              Active
            </Button>
          </div>
          <Tab.Panels>
            <Tab.Panel>
              <StreamTable
                activeOnly={showActiveIncoming}
                loading={isLoading}
                streams={streams}
                vestings={vestings}
                type={FuroTableType.INCOMING}
                placeholder="No incoming streams found"
              />
            </Tab.Panel>
            <Tab.Panel>
              <StreamTable
                activeOnly={showActiveIncoming}
                loading={isLoading}
                streams={streams}
                vestings={vestings}
                type={FuroTableType.OUTGOING}
                placeholder="No incoming streams found"
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </Container>
    </div>
  )
}
