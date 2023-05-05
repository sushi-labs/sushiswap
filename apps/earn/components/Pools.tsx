import { DotsVerticalIcon, ExternalLinkIcon } from '@heroicons/react/solid'
import { classNames, Link } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/future/components/button'
import React, { FC, Fragment } from 'react'
import { useNetwork } from '@sushiswap/wagmi'
import { Layout, PoolFilters, PoolsFiltersProvider, PoolsSection } from '../components'
import { ChainId } from '@sushiswap/chain'
import { isRouteProcessor3ChainId } from '@sushiswap/route-processor'
import { Popover, Transition } from '@headlessui/react'
import { List } from '@sushiswap/ui/future/components/list/List'
import { useBreakpoint } from '@sushiswap/ui/future'

export const Pools: FC<{ filters?: Partial<PoolFilters> }> = ({ filters }) => {
  const { chain } = useNetwork()
  const chainId = chain?.id || ChainId.ETHEREUM

  return (
    <Layout maxWidth="7xl">
      {/* <ExploitInfo /> */}
      <div className="flex flex-col gap-10 md:gap-16">
        <section className="flex flex-col gap-6 lg:flex-row justify-between">
          <div className="flex flex-col flex-grow max-w-md gap-2">
            <h1 className="font-semibold text-gray-900 text-7xl dark:text-slate-50">Pools.</h1>
            <span className="text-2xl text-gray-600 dark:text-slate-300">Provide liquidity and earn fees.</span>
          </div>
          <div className="flex justify-end">
            <div className="flex flex-col gap-3 w-full">
              <div className="group relative">
                <div className="flex justify-between w-full items-center gap-4">
                  <Button
                    as="a"
                    href={
                      isRouteProcessor3ChainId(chainId) ? `/pools/add?chainId=${chainId}` : `/pools/add/v2/${chainId}`
                    }
                    variant="filled"
                    size="xl"
                    className="pr-20"
                    fullWidth
                  >
                    New Position
                  </Button>
                  <div className="absolute right-2 top-2 bottom-2 w-[40px]">
                    <div className="relative z-[1000] w-full h-full">
                      <Popover as={Fragment}>
                        {({ open }) => (
                          <>
                            <Popover.Button
                              as="button"
                              className={classNames(
                                open ? 'bg-black/[0.12]' : 'bg-black/[0.06]',
                                'hover:bg-black/[0.12] h-full w-full flex items-center justify-center rounded-lg text-white'
                              )}
                            >
                              <DotsVerticalIcon width={20} height={20} />
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
                              <div className={classNames('right-[-8px] absolute pt-3 top-1 w-[320px]')}>
                                <div className="p-2 flex flex-col w-full right-0 absolute rounded-2xl shadow-md bg-white/50 paper dark:bg-slate-800/50">
                                  <Popover.Panel>
                                    <List.MenuItem
                                      disabled={!isRouteProcessor3ChainId(chainId)}
                                      as="a"
                                      href={`/pools/add?chainId=${chainId}`}
                                      title={
                                        <div className="flex gap-2">
                                          V3 Position{' '}
                                          {isRouteProcessor3ChainId(chainId) ? (
                                            <div className="rounded-xl bg-gradient-to-r from-pink to-blue text-white text-[10px] px-2">
                                              New 🔥
                                            </div>
                                          ) : (
                                            <div className="rounded-xl bg-gray-500 dark:bg-slate-600 text-white text-[10px] px-2">
                                              Unavailable
                                            </div>
                                          )}
                                        </div>
                                      }
                                      subtitle={`Most efficient way of providing liquidity.`}
                                    />
                                    <List.MenuItem
                                      as="a"
                                      href={`/pools/add/v2/${chainId}`}
                                      title="V2 Position"
                                      subtitle={`If you prefer creating a classic liquidity position.`}
                                    />
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
              </div>
              <Link.External href="https://rbieu62gj0f.typeform.com/to/KkrPkOFe">
                <Button fullWidth color="default" size="xl" className="pr-4">
                  <div className="flex justify-between w-full items-center gap-4">
                    Join Onsen
                    <ExternalLinkIcon width={20} height={20} />
                  </div>
                </Button>
              </Link.External>
            </div>
          </div>
        </section>
        <PoolsFiltersProvider passedFilters={filters}>
          <PoolsSection />
        </PoolsFiltersProvider>
      </div>
    </Layout>
  )
}

export default Pools
