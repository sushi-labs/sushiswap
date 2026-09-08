'use client'

import { ArrowRightIcon, ArrowUpIcon } from '@heroicons/react/24/outline'
import { useDebounce, useIsMounted, useLocalStorage } from '@sushiswap/hooks'
import { Button, Container, LinkInternal, SkeletonBox } from '@sushiswap/ui'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getEvmChainById } from 'sushi/evm'
import { isAddress } from 'viem'
import { formatUsd } from '../_lib/format'
import {
  getLaunchpadProvidersForFilter,
  parseLaunchpadProviderFilter,
} from '../_lib/launchpad-provider'
import { useLaunchpadStats } from '../_lib/use-launchpad-stats'
import { useLaunchpadTokens } from '../_lib/use-launchpad-tokens'
import type { LaunchpadChainId } from '../constants'
import { LaunchpadExploreControls } from './launchpad-explore-controls'
import { CollectionStateCard } from './state-card'
import { TokenGrid, TokenGridSkeleton } from './token-grid'
import { TokenPagination } from './token-pagination'
import { parseLaunchpadTokenSortField } from './token-sort-controls'
import { TokenTable } from './token-table'
import { TrendingTokens } from './trending-tokens'

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
  const isMounted = useIsMounted()
  const [storedView, setView] = useLocalStorage<'grid' | 'table'>(
    'sushi.launchpad.explore.view',
    'grid',
  )
  const view = isMounted && storedView === 'table' ? 'table' : 'grid'
  const [search, setSearch] = useState(urlSearch)
  const debouncedSearch = useDebounce(search, 250)
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  useEffect(() => setSearch(urlSearch), [urlSearch])
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
    hasNextPage,
    isError,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    isPending,
    refetch,
  } = useLaunchpadTokens(input, true)
  const tokens = data.edges.map((edge) => edge.node)
  const { data: stats, isLoading } = useLaunchpadStats({ chainId, providers })
  const loadMoreTokens = useCallback(() => {
    if (hasNextPage && !isFetching) void fetchNextPage()
  }, [fetchNextPage, hasNextPage, isFetching])

  return (
    <>
      <Container
        maxWidth="7xl"
        className="w-full px-4 sm:px-8 pb-8 pt-8 sm:pt-10"
      >
        <div className="bg-[#151A20] rounded-2xl border border-white/[0.07] px-4 lg:px-10 py-5">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start items-center lg:justify-between">
            <div className="max-w-3xl flex flex-col gap-2 lg:gap-6 lg:mt-4">
              <div className="flex flex-col md:flex-row gap-0 md:gap-2 lg:gap-0 lg:flex-col">
                <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-perps-muted sm:text-4xl lg:text-5xl ">
                  Launch a token.
                </h1>
                <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-perps-muted sm:text-4xl lg:text-5xl ">
                  Create its market.
                </h1>
              </div>
              <p className="lg:max-w-[400px] text-sm leading-6 text-perps-muted-50 sm:text-base">
                Launch with live Sushi liquidity and pair with crypto, Stock
                Tokens and RWAs.
              </p>
              <LinkInternal
                href={`/${chainKey}/launchpad/create`}
                className="mt-1 md:mx-auto lg:mx-0"
              >
                <Button
                  asChild
                  size="lg"
                  variant="perps-default"
                  icon={ArrowRightIcon}
                  iconPosition="end"
                  className="!px-8"
                >
                  Create token
                </Button>
              </LinkInternal>
            </div>
            <div className="w-full lg:w-fit">
              <TrendingTokens chainId={chainId} />
            </div>
          </div>
          <hr className="w-full h-px border-white/[0.07] mt-12 mb-6" />

          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-0">
            {[
              {
                label: 'Tokens launched',
                value: stats?.totalTokensLaunched?.toString() ?? '—',
              },
              {
                label: '24H Volume',
                value: formatUsd(stats?.totalVolumeUsd24h),
              },
              {
                label: 'Liquidity',
                value: formatUsd(stats?.totalLiquidityUsd),
              },
            ].map((stat, idx) => (
              <div key={stat.label} className="flex items-center">
                <div className="flex justify-center items-center md:gap-2 flex-col-reverse md:flex-row">
                  <div className="text-lg font-bold text-white">
                    {isLoading ? (
                      <SkeletonBox className="h-6 w-20 rounded-md" />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-base text-perps-muted-50 whitespace-nowrap">
                    {stat.label}
                  </div>
                </div>
                {idx < 2 && (
                  <div className="mx-6 hidden h-1 w-1 shrink-0 rounded-full bg-perps-muted-20 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>

      <section id="discover">
        <Container maxWidth="8xl" className="w-full px-4 sm:px-8">
          <div className="bg-[#151A20] rounded-2xl border border-white/[0.07] px-4 py-5 sm:p-8">
            <LaunchpadExploreControls
              search={search}
              onSearchChange={(value) => {
                setSearch(value)
                updateParams({ search: value || undefined })
              }}
              sortBy={sortBy}
              onSortByChange={(nextSortBy) =>
                updateParams({ sortBy: nextSortBy, sortDirection: undefined })
              }
              providerFilter={providerFilter}
              onProviderFilterChange={(nextFilter) =>
                updateParams({
                  provider: nextFilter === 'all' ? undefined : nextFilter,
                })
              }
              view={view}
              onViewChange={setView}
            />

            <div className="mt-6">
              {isError && tokens.length === 0 ? (
                <CollectionStateCard
                  description="Launches could not be loaded."
                  action={
                    <Button variant="perps-secondary" onClick={() => refetch()}>
                      Try again
                    </Button>
                  }
                />
              ) : view === 'table' ? (
                <TokenTable
                  key={infiniteScrollKey}
                  tokens={tokens}
                  sortBy={sortBy}
                  isLoading={isPending}
                  hasNextPage={hasNextPage}
                  isFetching={isFetching}
                  isFetchingNextPage={isFetchingNextPage}
                  isFetchNextPageError={isFetchNextPageError}
                  onLoadMore={loadMoreTokens}
                />
              ) : isPending ? (
                <TokenGridSkeleton />
              ) : (
                <div key={infiniteScrollKey}>
                  <TokenGrid
                    tokens={tokens}
                    sortBy={sortBy}
                    isFetchingNextPage={isFetchingNextPage}
                  />
                  <TokenPagination
                    hasNextPage={hasNextPage}
                    isFetching={isFetching}
                    isFetchingNextPage={isFetchingNextPage}
                    isFetchNextPageError={isFetchNextPageError}
                    onLoadMore={loadMoreTokens}
                  />
                </div>
              )}
            </div>
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
