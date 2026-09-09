'use client'

import { ArrowUpIcon } from '@heroicons/react/24/outline'
import { useDebounce, useIsMounted, useLocalStorage } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getEvmChainById } from 'sushi/evm'
import { isAddress } from 'viem'
import {
  getLaunchpadProvidersForFilter,
  parseLaunchpadProviderFilter,
} from '../../_lib/launchpad-provider'
import { useLaunchpadStats } from '../../_lib/use-launchpad-stats'
import { useLaunchpadTokens } from '../../_lib/use-launchpad-tokens'
import type { LaunchpadChainId } from '../../constants'
import { CollectionStateCard } from '../_common/state-card'
import { LaunchpadExploreControls } from '../explore/launchpad-explore-controls'
import { LaunchpadExploreSection } from '../explore/launchpad-explore-section'
import { parseLaunchpadTokenSortField } from '../explore/token-sort-controls'
import { TokenGrid, TokenGridSkeleton } from '../token-list/token-grid'
import { TokenPagination } from '../token-list/token-pagination'
import { TokenTable } from '../token-list/token-table'
import { TrendingTokens } from '../trending/trending-tokens'
import { LaunchpadHero } from './launchpad-hero'

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
      <LaunchpadHero
        createHref={`/${chainKey}/launchpad/create`}
        trending={<TrendingTokens chainId={chainId} />}
        stats={stats}
        isLoading={isLoading}
      />
      <LaunchpadExploreSection
        controls={
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
        }
      >
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
      </LaunchpadExploreSection>
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
