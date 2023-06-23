import { Tab } from '@headlessui/react'
import React, { FC, Fragment, useState } from 'react'
import { useUserStreams, useUserVestings } from '../lib'
import { Button } from '@sushiswap/ui/components/button'
import { SushiIcon } from '@sushiswap/ui/components/icons'
import { Container } from '@sushiswap/ui/components/container'
import { Address, useAccount } from '@sushiswap/wagmi'
import { FuroTableType, StreamTable } from './Table'
import { Toggle } from '@sushiswap/ui/components/toggle'

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
        <section className="flex flex-col justify-between gap-12">
          <div className="flex flex-col items-center flex-grow gap-6 lg:items-start">
            <div className="flex flex-col gap-12 lg:flex-row">
              <div className="flex flex-col gap-5">
                <h1 className="mt-2 text-5xl font-semibold">
                  Want to stream
                  <br /> to someone?
                </h1>
                <span className="text-2xl font-medium text-gray-600 dark:text-slate-400 leading-[1.5]">
                  Sushi Pay allows you to stream any ERC20 to any wallet.
                </span>
                <div className="relative z-10 mt-2 group">
                  <div className="flex items-center w-full">
                    <Button asChild size="xl">
                      <a href="/furo/create">Pay Someone</a>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="shadow-lg relative w-full lg:w-[460px] aspect-[460/290] bg-gradient-to-tr from-blue to-pink flex flex-col bg-slate-800 p-4 rounded-2xl">
                  <span className="flex items-center justify-start gap-2">
                    <div className="flex flex-col">
                      <span className="font-medium text-white">SUSHI</span>
                      <span className="text-2xl font-medium text-white">5000</span>
                    </div>
                  </span>
                  <div className="absolute flex items-center justify-center gap-3 bottom-4 right-4">
                    <div className="p-2 rounded-full shadow-md bg-white/10">
                      <SushiIcon width={22} height={22} />
                    </div>
                    <span className="text-2xl font-medium tracking-[-0.025em] text-white">
                      Sushi <span className="font-bold">Pay</span>
                    </span>
                  </div>
                  <div className="absolute flex flex-col text-lg font-semibold tracking-wide text-white left-5 bottom-4 text-sh mono">
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
                <Toggle size="sm" pressed={selected}>
                  Incoming
                </Toggle>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <Toggle size="sm" pressed={selected}>
                  Outgoing
                </Toggle>
              )}
            </Tab>
            <Toggle
              pressed={showActiveIncoming}
              onPressedChange={() => setShowActiveIncoming((prevState) => !prevState)}
              size="sm"
            >
              Active
            </Toggle>
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
