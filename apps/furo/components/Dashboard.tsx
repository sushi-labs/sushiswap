import { Tab, Transition, Popover } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { Token } from '@sushiswap/currency'
import { FuroStreamChainId } from '@sushiswap/furo'
import { classNames } from '@sushiswap/ui'
import { useRouter } from 'next/router'
import { FC, Fragment, useEffect, useMemo, useState } from 'react'
import { toToken, useStreamBalances, useUserStreams, useUserVestings } from '../lib'
import { FuroTableType, StreamTable } from './Table'
import { Button } from '@sushiswap/ui/future/components/button'
import { DiscordIcon } from '@sushiswap/ui/future/components/icons'
import Container from '@sushiswap/ui/future/components/Container'
import { List } from '@sushiswap/ui/future/components/list/List'
import { Link } from '@sushiswap/ui'
import { useRebasesDTO } from '../lib/hooks/useRebasesDTO'

export const Dashboard: FC<{
  chainId: FuroStreamChainId
  address: string
  showOutgoing: boolean
}> = ({ chainId, address, showOutgoing }) => {
  const router = useRouter()
  const [showActiveIncoming, setShowActiveIncoming] = useState(false)

  const { data: streams, isLoading: isStreamsLoading } = useUserStreams({ chainId, account: address })
  const { data: vestings, isLoading: isVestingsLoading } = useUserVestings({ chainId, account: address })

  const [tokens, _streams] = useMemo(() => {
    const _streams: { streamId: string; token: Token }[] = []
    const tokens: Token[] = []

    const allStreams = [...(streams?.incomingStreams || []), ...(streams?.outgoingStreams || [])]
    allStreams.forEach((stream) => {
      const token = toToken(stream.token, chainId)
      _streams.push({
        streamId: stream.id,
        token,
      })
      tokens.push(token)
    })

    vestings?.incomingVestings?.forEach((vesting) => tokens.push(toToken(vesting.token, chainId)))
    vestings?.outgoingVestings?.forEach((vesting) => tokens.push(toToken(vesting.token, chainId)))

    return [tokens, _streams]
  }, [chainId, streams, vestings?.incomingVestings, vestings?.outgoingVestings])

  const { data: rebases, isLoading: isRebasesLoading } = useRebasesDTO({
    chainId,
    addresses: tokens.map((el) => el.address),
  })

  const { data: balances, isLoading: isBalancesLoading } = useStreamBalances({ chainId, streams: _streams })

  // Prefetch stream/vesting pages
  useEffect(() => {
    void router.prefetch('/stream/[id]')
    void router.prefetch('/vesting/[id]')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isLoading = isStreamsLoading || isVestingsLoading || isRebasesLoading || isBalancesLoading

  return (
    <>
      <Container maxWidth="7xl" className="mx-auto px-4 pt-[80px] lg:pb-[54px]">
        <section className="flex flex-col gap-12 lg:flex-row justify-between lg:items-start">
          <div className="flex flex-col flex-grow gap-6 items-center lg:items-start">
            <div className="flex flex-col">
              <span className="text-center lg:text-left font-semibold text-5xl text-gray-800 dark:text-slate-200 leading-[1.2]">
                Sushi Pay.
              </span>
            </div>
            <div className="group relative z-10">
              <div className="flex w-full items-center">
                <Button variant="filled" className="text-blue font-medium text-xl rounded-l-full" size="lg">
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
                        enterFrom="transform translate-y-[-16px] scale-[0.95] opacity-0"
                        enterTo="transform translate-y-0 scale-[1] opacity-100"
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
          <div className="flex flex-col gap-4 items-center lg:items-end">
            <div className="flex flex-col gap-1 items-center lg:items-end">
              <span className="lg:text-sm font-semibold">Need Help?</span>
              <Link.External
                href="https://discord.gg/NVPXN4e"
                className="font-medium text-blue hover:!text-blue-600 lg:text-sm flex gap-1 items-center"
              >
                <DiscordIcon width={16} height={16} /> Join our discord
              </Link.External>
            </div>
          </div>
        </section>
      </Container>
      <Container maxWidth="7xl" className="mx-auto px-4">
        <Tab.Group defaultIndex={showOutgoing ? 1 : 0}>
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
                chainId={chainId}
                balances={balances}
                globalFilter={showActiveIncoming}
                setGlobalFilter={setShowActiveIncoming}
                loading={isLoading}
                streams={streams?.incomingStreams ?? []}
                vestings={vestings?.incomingVestings ?? []}
                rebases={rebases}
                type={FuroTableType.INCOMING}
                placeholder={
                  <>
                    No <b>incoming</b> streams found
                  </>
                }
              />
            </Tab.Panel>
            <Tab.Panel>
              <StreamTable
                chainId={chainId}
                balances={balances}
                globalFilter={showActiveIncoming}
                setGlobalFilter={setShowActiveIncoming}
                loading={isLoading}
                streams={streams?.outgoingStreams ?? []}
                vestings={vestings?.outgoingVestings ?? []}
                rebases={rebases}
                type={FuroTableType.OUTGOING}
                placeholder={
                  <>
                    No <b>outgoing</b> streams found
                  </>
                }
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </Container>
    </>
  )
}
