'use client'

import {
  ArrowRightIcon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
  SignalIcon,
} from '@heroicons/react/24/outline'
import { useDebounce } from '@sushiswap/hooks'
import {
  Button,
  Container,
  LinkInternal,
  SkeletonBox,
  TextField,
} from '@sushiswap/ui'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getEvmChainById } from 'sushi/evm'
import { isAddress } from 'viem'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import { formatUsd } from '../_lib/format'
import {
  LAUNCHPAD_PROVIDER_FILTERS,
  getLaunchpadProvidersForFilter,
  parseLaunchpadProviderFilter,
} from '../_lib/launchpad-provider'
import { useLaunchpadStats } from '../_lib/use-launchpad-stats'
import { useLaunchpadTokens } from '../_lib/use-launchpad-tokens'
import type { LaunchpadChainId } from '../constants'
import { LaunchpadProviderMark } from './launchpad-provider-mark'
import { MetricStrip, MetricStripItem } from './metric-strip'
import { CollectionStateCard } from './state-card'
import { TokenGrid, TokenGridSkeleton } from './token-grid'
import {
  TokenSortControls,
  parseLaunchpadTokenSortField,
} from './token-sort-controls'

export function LaunchpadHomePage({ chainId }: { chainId: LaunchpadChainId }) {
  const chainKey = getEvmChainById(chainId).key
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlSearch = searchParams.get('search') ?? ''
  const urlCreator = searchParams.get('creator') ?? ''
  const providerFilter = parseLaunchpadProviderFilter(
    searchParams.get('provider'),
  )
  const sortBy = parseLaunchpadTokenSortField(searchParams.get('sortBy'))
  const [search, setSearch] = useState(urlSearch)
  const debouncedSearch = useDebounce(search, 250)
  const [creator, setCreator] = useState(urlCreator)
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  useEffect(() => setSearch(urlSearch), [urlSearch])
  useEffect(() => setCreator(urlCreator), [urlCreator])
  useEffect(() => {
    function handleScroll() {
      setShowScrollToTop(window.scrollY >= 1_000)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const next = new URLSearchParams(window.location.search)
      for (const [key, value] of Object.entries(updates)) {
        if (value) next.set(key, value)
        else next.delete(key)
      }
      const query = next.toString()
      history.replaceState(null, '', query ? `${pathname}?${query}` : pathname)
    },
    [pathname],
  )

  const providers = useMemo(
    () => getLaunchpadProvidersForFilter(providerFilter),
    [providerFilter],
  )
  const input = useMemo(
    () => ({
      chainId,
      providers,
      search: debouncedSearch || undefined,
      creator:
        urlCreator && isAddress(urlCreator, { strict: false })
          ? urlCreator
          : undefined,
      first: 20,
      sortBy,
      sortDirection: 'DESC' as const,
    }),
    [chainId, debouncedSearch, providers, sortBy, urlCreator],
  )
  const infiniteScrollKey = useMemo(
    () =>
      JSON.stringify({
        chainId: input.chainId,
        providers: input.providers,
        search: input.search ?? null,
        creator: input.creator ?? null,
        sortBy: input.sortBy,
        sortDirection: input.sortDirection,
      }),
    [input],
  )
  const {
    data,
    fetchNextPage,
    isError,
    isFetchingNextPage,
    isPending,
    refetch,
  } = useLaunchpadTokens(input, true)
  const tokens = data.edges.map((edge) => edge.node)
  const { data: stats, isLoading } = useLaunchpadStats({ chainId, providers })

  return (
    <>
      <Container maxWidth="7xl" className="w-full px-4 pb-8 pt-8 sm:pt-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-perps-muted sm:text-5xl">
              Discover tokens as they launch.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-perps-muted-50 sm:text-base">
              Follow live markets, trade directly from each token page, and
              launch with permanently locked Sushi V3 liquidity.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <LinkInternal href={`/${chainKey}/launchpad/create`}>
              <Button
                asChild
                size="lg"
                variant="perps-default"
                icon={ArrowRightIcon}
                iconPosition="end"
              >
                Create token
              </Button>
            </LinkInternal>
          </div>
        </div>

        <div className="mt-7">
          <MetricStrip>
            {[
              {
                label: 'Tokens launched',
                value: `${stats?.totalTokensLaunched}`,
              },
              {
                label: '24h volume',
                value: formatUsd(stats?.totalVolumeUsd24h),
              },
              {
                label: 'Liquidity',
                value: formatUsd(stats?.totalLiquidityUsd),
              },
            ].map((stat, index) => (
              <MetricStripItem
                key={stat.label}
                index={index}
                label={stat.label}
                value={
                  isLoading ? (
                    <SkeletonBox className="h-7 w-20 rounded-md" />
                  ) : (
                    stat.value
                  )
                }
              />
            ))}
            <div className="flex items-center gap-3 border-l border-white/[0.06] border-t lg:border-t-0 px-5 py-4">
              <span className="hidden sm:grid h-9 w-9 place-items-center rounded-full bg-emerald-500/10 text-emerald-400">
                <SignalIcon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-perps-muted-50">
                  Market feeds
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 motion-reduce:animate-none" />
                  Live
                </div>
              </div>
            </div>
          </MetricStrip>
        </div>
      </Container>

      <section id="discover" className="border-t border-white/[0.04] py-8">
        <Container maxWidth="7xl" className="w-full px-4">
          <PerpsCard className="p-3 sm:p-4" fullWidth>
            <div className="grid gap-3 md:grid-cols-[minmax(240px,1fr)_auto]">
              <TextField
                type="text"
                value={search}
                onChange={(event) => {
                  const value = event.target.value
                  setSearch(value)
                  updateParams({ search: value || undefined })
                }}
                icon={MagnifyingGlassIcon}
                placeholder="Search name, symbol, or address"
                aria-label="Search launches"
                className="!bg-white/[0.04] !text-perps-muted xl:!max-w-[480px]"
              />
              <TextField
                type="text"
                value={creator}
                onChange={(event) => {
                  const value = event.target.value
                  setCreator(value)
                  updateParams({ creator: value || undefined })
                }}
                placeholder="Filter by creator address"
                aria-label="Filter by creator address"
                className="!bg-white/[0.04] !text-perps-muted"
                wrapperClassName="hidden"
              />
              <TokenSortControls
                sortBy={sortBy}
                onSortByChange={(nextSortBy) =>
                  updateParams({
                    sortBy: nextSortBy,
                    sortDirection: undefined,
                  })
                }
              />
            </div>
            <div
              className="mt-3 flex flex-wrap items-center gap-2"
              role="group"
              aria-label="Filter launches by provider"
            >
              {LAUNCHPAD_PROVIDER_FILTERS.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  size="sm"
                  variant={
                    option.value === providerFilter
                      ? 'perps-default'
                      : 'perps-secondary'
                  }
                  aria-pressed={option.value === providerFilter}
                  onClick={() =>
                    updateParams({
                      provider:
                        option.value === 'all' ? undefined : option.value,
                    })
                  }
                >
                  <span className="flex items-center gap-1.5">
                    <span className="flex items-center" aria-hidden>
                      {getLaunchpadProvidersForFilter(option.value).map(
                        (provider, index) => (
                          <LaunchpadProviderMark
                            key={provider}
                            provider={provider}
                            size="sm"
                            className={
                              index > 0
                                ? '-ml-1 rounded-full ring-2 ring-perps-background'
                                : undefined
                            }
                          />
                        ),
                      )}
                    </span>
                    {option.label}
                  </span>
                </Button>
              ))}
            </div>
          </PerpsCard>

          <div className="mt-6">
            {isPending ? (
              <TokenGridSkeleton />
            ) : isError ? (
              <CollectionStateCard
                description="Launches could not be loaded."
                action={
                  <Button variant="perps-secondary" onClick={() => refetch()}>
                    Try again
                  </Button>
                }
              />
            ) : (
              <InfiniteScroll
                key={infiniteScrollKey}
                dataLength={tokens.length}
                next={fetchNextPage}
                hasMore={data.pageInfo.hasNextPage}
                loader={null}
                className="!overflow-visible"
              >
                <TokenGrid
                  tokens={tokens}
                  sortBy={sortBy}
                  isFetchingNextPage={isFetchingNextPage}
                />
              </InfiniteScroll>
            )}
          </div>
        </Container>
      </section>
      {showScrollToTop ? (
        <Button
          type="button"
          variant="perps-secondary"
          className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full !p-0 shadow-lg"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          title="Back to top"
        >
          <ArrowUpIcon className="h-5 w-5" />
        </Button>
      ) : null}
    </>
  )
}
