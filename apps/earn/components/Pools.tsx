import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsVerticalIcon,
  ExternalLinkIcon,
} from '@heroicons/react/solid'
import { classNames, Link } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/future/components/button'
import React, { FC, Fragment, useCallback, useRef } from 'react'
import { useNetwork } from '@sushiswap/wagmi'
import { Layout, PoolFilters, PoolsFiltersProvider, PoolsSection } from '../components'
import { ChainId } from '@sushiswap/chain'
import { isRouteProcessor3ChainId } from '@sushiswap/route-processor'
import { Popover, Transition } from '@headlessui/react'
import { List } from '@sushiswap/ui/future/components/list/List'
import { PositionCardList } from './MigratePage/PositionCardList'
import Container from '@sushiswap/ui/future/components/Container'
import { PositionCard, PositionCardSkeleton } from './MigratePage/PositionCard'
import { Carousel } from '@sushiswap/ui/future/components/Carousel'
import { DiscordIcon, OnsenIcon } from '@sushiswap/ui/future/components/icons'
import { useAccount } from 'wagmi'
import { isUniswapV2FactoryChainId } from '@sushiswap/sushiswap'
import { isConstantProductPoolFactoryChainId, isStablePoolFactoryChainId } from '@sushiswap/trident'

export const Pools: FC<{ filters?: Partial<PoolFilters> }> = ({ filters }) => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const chainId = chain?.id || ChainId.ETHEREUM

  return (
    <>
      <Container maxWidth="7xl" className="mx-auto px-4 pt-[80px] lg:pb-[54px]">
        <section className="flex flex-col gap-12 lg:flex-row justify-between lg:items-center">
          <div className="flex flex-col flex-grow gap-6 items-center lg:items-start">
            <div className="flex flex-col gap-2">
              <span className="text-center lg:text-left font-semibold text-5xl text-gray-800 dark:text-slate-200 leading-[1.2]">
                Provide Liquidity
                <span className="font-medium text-gray-500 dark:text-slate-500">
                  <br /> and receive fees & rewards<sup className="text-sm top-[-24px]">1</sup>
                </span>
              </span>
            </div>
            <div className="group relative z-10">
              <div className="flex w-full items-center">
                <Button
                  as="a"
                  variant="filled"
                  href={
                    isRouteProcessor3ChainId(chainId) ? `/pools/add?chainId=${chainId}` : `/pools/add/v2/${chainId}`
                  }
                  className="text-blue font-medium text-xl rounded-l-full"
                  size="lg"
                >
                  Create Position
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
                                subtitle={'Most efficient way of providing liquidity.'}
                              />
                              {isUniswapV2FactoryChainId(chainId) ? (
                                <List.MenuItem
                                  as="a"
                                  href={`/pools/add/v2/${chainId}`}
                                  title="V2 Position"
                                  subtitle={'If you prefer creating a v2 liquidity position.'}
                                />
                              ) : null}
                              {isConstantProductPoolFactoryChainId(chainId) || isStablePoolFactoryChainId(chainId) ? (
                                <List.MenuItem
                                  as="a"
                                  href={`/pools/add/trident/${chainId}`}
                                  title={
                                    <div className="flex gap-2">
                                      Trident Position{' '}
                                      <div className="rounded-xl bg-slate-900 text-white text-[10px] px-2">
                                        Deprecating 💀
                                      </div>
                                    </div>
                                  }
                                  subtitle={'If you prefer creating a trident liquidity position.'}
                                />
                              ) : null}
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
              <span className="lg:text-sm font-semibold">Looking for a partnership with Sushi?</span>
              <Link.External
                href="https://rbieu62gj0f.typeform.com/to/KkrPkOFe"
                className="font-medium text-blue hover:!text-blue-600 lg:text-sm flex gap-1 items-center"
              >
                Join Onsen <ChevronRightIcon width={16} height={16} />
              </Link.External>
            </div>
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
      {address && (
        <PositionCardList>
          {({ positions, isLoading }) =>
            !isLoading && positions?.[0] ? (
              <section className="flex flex-col gap-3 py-10 lg:py-[54px]">
                <Container maxWidth="7xl" className="mx-auto px-4">
                  <h1 className="text-3xl font-semibold text-gray-800 dark:text-slate-200 text-center lg:text-start">
                    Migrate <span className="text-gray-500 dark:text-slate-500">for increased efficiency.</span>
                  </h1>
                </Container>
                <div className="pl-4 xl:pl-0">
                  <Carousel
                    slideWidth={320}
                    slides={positions}
                    render={(position) => (isLoading ? <PositionCardSkeleton /> : <PositionCard position={position} />)}
                  />
                </div>
              </section>
            ) : (
              <></>
            )
          }
        </PositionCardList>
      )}
      <Container maxWidth="7xl" className="mx-auto px-4">
        <PoolsFiltersProvider passedFilters={filters}>
          <PoolsSection />
        </PoolsFiltersProvider>
      </Container>
    </>
  )
}

export default Pools
