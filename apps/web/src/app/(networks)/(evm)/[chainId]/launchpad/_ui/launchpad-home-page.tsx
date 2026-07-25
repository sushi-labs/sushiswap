'use client'

import {
  ArrowRightIcon,
  BoltIcon,
  MagnifyingGlassIcon,
  SignalIcon,
} from '@heroicons/react/24/outline'
import {
  Button,
  Container,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TextField,
  classNames,
} from '@sushiswap/ui'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getEvmChainById } from 'sushi/evm'
import { isAddress } from 'viem'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import type { LaunchpadChainId } from '../constants'
import { useLaunchpadTokens } from '../hooks/use-launchpad-data'
import type { LaunchpadTokenSortField } from '../types'
import { formatUsd } from './format'
import { PageHeading } from './page-heading'
import { TokenGrid } from './token-grid'

type SortMetric = 'VOLUME' | 'CURRENT_TVL' | 'CREATED_AT'
type VolumePeriod = '1H' | '6H' | '12H' | '24H'

const SORT_METRICS: Array<{ value: SortMetric; label: string }> = [
  { value: 'VOLUME', label: 'Volume' },
  { value: 'CURRENT_TVL', label: 'Liquidity' },
  { value: 'CREATED_AT', label: 'Newest' },
]

const VOLUME_PERIODS: VolumePeriod[] = ['1H', '6H', '12H', '24H']

const VOLUME_SORT_FIELDS = {
  '1H': 'VOLUME_1H',
  '6H': 'VOLUME_6H',
  '12H': 'VOLUME_12H',
  '24H': 'VOLUME_24H',
} as const satisfies Record<VolumePeriod, LaunchpadTokenSortField>

const SORT_FIELDS = new Set<LaunchpadTokenSortField>([
  ...Object.values(VOLUME_SORT_FIELDS),
  'CURRENT_TVL',
  'CREATED_AT',
])

function getSortMetric(sortBy: LaunchpadTokenSortField): SortMetric {
  if (sortBy === 'CURRENT_TVL' || sortBy === 'CREATED_AT') return sortBy
  return 'VOLUME'
}

function getVolumePeriod(sortBy: LaunchpadTokenSortField): VolumePeriod {
  const period = VOLUME_PERIODS.find(
    (candidate) => VOLUME_SORT_FIELDS[candidate] === sortBy,
  )
  return period ?? '24H'
}

export function LaunchpadHomePage({ chainId }: { chainId: LaunchpadChainId }) {
  const chainKey = getEvmChainById(chainId).key
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlSearch = searchParams.get('search') ?? ''
  const urlCreator = searchParams.get('creator') ?? ''
  const requestedSort = searchParams.get('sortBy') as LaunchpadTokenSortField
  const sortBy = SORT_FIELDS.has(requestedSort) ? requestedSort : 'VOLUME_24H'
  const sortMetric = getSortMetric(sortBy)
  const volumePeriod = getVolumePeriod(sortBy)
  const [search, setSearch] = useState(urlSearch)
  const [creator, setCreator] = useState(urlCreator)

  useEffect(() => setSearch(urlSearch), [urlSearch])
  useEffect(() => setCreator(urlCreator), [urlCreator])

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value) next.set(key, value)
        else next.delete(key)
      }
      const query = next.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      })
    },
    [pathname, router, searchParams],
  )

  const input = useMemo(
    () => ({
      chainId,
      search: urlSearch || undefined,
      creator:
        urlCreator && isAddress(urlCreator, { strict: false })
          ? urlCreator
          : undefined,
      first: 20,
      sortBy,
      sortDirection: 'DESC' as const,
    }),
    [chainId, sortBy, urlCreator, urlSearch],
  )
  const {
    data,
    fetchNextPage,
    isError,
    isFetchingNextPage,
    isPending,
    refetch,
  } = useLaunchpadTokens(input)
  const tokens = data.edges.map((edge) => edge.node)
  const totalVolume = tokens.reduce(
    (total, token) => total + (token.metrics?.volumeUsd.h24 ?? 0),
    0,
  )
  const totalLiquidity = tokens.reduce(
    (total, token) => total + (token.metrics?.currentTvlUsd ?? 0),
    0,
  )

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
            <Button
              asChild
              size="lg"
              variant="perps-default"
              icon={ArrowRightIcon}
              iconPosition="end"
            >
              <Link href={`/${chainKey}/launchpad/create`}>Create token</Link>
            </Button>
          </div>
        </div>

        <div className="mt-7">
          <PerpsCard className="overflow-hidden" fullWidth>
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Tokens launched', value: `${data.totalCount}` },
                { label: '24h volume', value: formatUsd(totalVolume) },
                { label: 'Locked liquidity', value: formatUsd(totalLiquidity) },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className={`${index > 0 ? 'border-l border-white/[0.06]' : ''} px-5 py-4`}
                >
                  <div className="text-[11px] uppercase tracking-wide text-perps-muted-50">
                    {stat.label}
                  </div>
                  <div className="mt-1 text-lg font-semibold text-perps-muted">
                    {stat.value}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-3 border-l border-white/[0.06] px-5 py-4">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <SignalIcon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-perps-muted-50">
                    Market feeds
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Live
                  </div>
                </div>
              </div>
            </div>
          </PerpsCard>
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
              <div className="flex flex-col gap-3 sm:flex-row">
                <Select
                  value={sortMetric}
                  onValueChange={(value) => {
                    const metric = value as SortMetric
                    updateParams({
                      sortBy:
                        metric === 'VOLUME'
                          ? VOLUME_SORT_FIELDS[volumePeriod]
                          : metric,
                      sortDirection: undefined,
                    })
                  }}
                >
                  <SelectTrigger
                    aria-label="Sort launches by"
                    className="w-full sm:w-[150px] !border !border-white/[0.06] !bg-white/[0.04] !text-perps-muted focus:!border-perps-blue"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="!bg-black/10 backdrop-blur-2xl">
                    {SORT_METRICS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div
                  role="radiogroup"
                  aria-label="Volume period"
                  aria-disabled={sortMetric !== 'VOLUME'}
                  className={classNames(
                    'flex h-10 shrink-0 items-center rounded-lg border border-white/[0.06] bg-white/[0.04] p-1 transition-opacity',
                    sortMetric !== 'VOLUME' && 'opacity-40',
                  )}
                >
                  {VOLUME_PERIODS.map((period) => {
                    const selected =
                      sortMetric === 'VOLUME' && volumePeriod === period
                    return (
                      <button
                        key={period}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={sortMetric !== 'VOLUME'}
                        onClick={() =>
                          updateParams({
                            sortBy: VOLUME_SORT_FIELDS[period],
                            sortDirection: undefined,
                          })
                        }
                        className={classNames(
                          'h-8 min-w-10 rounded-md px-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-perps-blue/50 disabled:cursor-not-allowed',
                          selected
                            ? 'bg-white/[0.09] text-perps-muted shadow-sm'
                            : 'text-perps-muted-50 hover:text-perps-muted disabled:hover:text-perps-muted-50',
                        )}
                      >
                        {period}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </PerpsCard>

          <div className="mt-6">
            {isPending ? (
              <PerpsCard
                className="grid min-h-64 place-items-center p-8 text-center text-sm text-perps-muted-50"
                fullWidth
              >
                Loading launches…
              </PerpsCard>
            ) : isError ? (
              <PerpsCard
                className="grid min-h-64 place-items-center p-8 text-center"
                fullWidth
              >
                <div>
                  <p className="text-sm text-perps-muted-50">
                    Launches could not be loaded.
                  </p>
                  <Button
                    variant="perps-secondary"
                    className="mt-4"
                    onClick={() => refetch()}
                  >
                    Try again
                  </Button>
                </div>
              </PerpsCard>
            ) : (
              <TokenGrid tokens={tokens} sortBy={sortBy} />
            )}
          </div>
          {data.pageInfo.hasNextPage ? (
            <div className="mt-8 text-center">
              <Button
                variant="perps-secondary"
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                {isFetchingNextPage ? 'Loading…' : 'Load more'}
              </Button>
            </div>
          ) : tokens.length > 0 ? (
            <div className="mt-8 text-center text-sm text-perps-muted-50">
              You&apos;re all caught up.
            </div>
          ) : null}
        </Container>
      </section>
    </>
  )
}
