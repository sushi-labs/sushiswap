'use client'

import {
  ArrowTopRightOnSquareIcon,
  CheckBadgeIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { Button, Container, TextField } from '@sushiswap/ui'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { getEvmChainById } from 'sushi/evm'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import { formatUsd, shortenAddress } from '../../../_ui/format'
import { MetricCard } from '../../../_ui/metric-card'
import { PageHeading } from '../../../_ui/page-heading'
import { TokenGrid } from '../../../_ui/token-grid'
import type { LaunchpadChainId } from '../../../constants'
import { useLaunchpadCreator } from '../../../hooks/use-launchpad-data'
import type { LaunchpadTokenSortField } from '../../../types'

export function CreatorPage({
  chainId,
  address,
}: {
  chainId: LaunchpadChainId
  address: EvmAddress
}) {
  const chainKey = getEvmChainById(chainId).key
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<LaunchpadTokenSortField>('VOLUME_24H')
  const filters = useMemo(
    () => ({
      search: search || undefined,
      sortBy,
      sortDirection: 'DESC' as const,
      first: 20,
    }),
    [search, sortBy],
  )
  const {
    data: creator,
    isError,
    isPending,
    refetch,
  } = useLaunchpadCreator(chainId, address, filters)
  const tokens = creator?.launches.edges.map((edge) => edge.node) ?? []
  const allTimeVolume = tokens.reduce(
    (total, token) => total + (token.metrics?.volumeUsd.h24 ?? 0),
    0,
  )
  const totalTvl = tokens.reduce(
    (total, token) => total + (token.metrics?.currentTvlUsd ?? 0),
    0,
  )

  return (
    <>
      <Container maxWidth="7xl" className="w-full px-4 py-10 sm:py-14">
        <PageHeading
          title={shortenAddress(address, 7)}
          description="Every launch below is tied to this immutable onchain creator address."
          action={
            <div className="flex gap-2">
              <Button
                variant="perps-secondary"
                size="sm"
                aria-label="Copy creator address"
              >
                <DocumentDuplicateIcon className="h-4 w-4" />
                Copy
              </Button>
              <Button variant="perps-secondary" size="sm">
                Explorer
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </Button>
            </div>
          }
        />

        <div className="mt-8">
          <PerpsCard className="overflow-hidden" fullWidth>
            <div className="flex flex-col gap-5 bg-gradient-to-r from-perps-blue/[0.08] to-violet-500/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="flex min-w-0 items-center gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-perps-blue text-lg font-bold text-white shadow-sm">
                  {address.slice(2, 4).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-semibold text-perps-muted">
                    Onchain creator
                    <CheckBadgeIcon className="h-5 w-5 text-perps-blue" />
                  </div>
                  <div className="mt-1 truncate font-mono text-xs text-perps-muted-50 sm:text-sm">
                    {address}
                  </div>
                </div>
              </div>
              <Button asChild variant="perps-secondary">
                <Link href={`/${chainKey}/launchpad/manage`}>
                  View creator dashboard
                </Link>
              </Button>
            </div>
          </PerpsCard>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
          <MetricCard
            label="Confirmed launches"
            value={creator?.launchCount ?? 0}
          />
          <MetricCard label="Combined TVL" value={formatUsd(totalTvl)} />
          <MetricCard
            label="Combined 24h volume"
            value={formatUsd(allTimeVolume)}
            detail="Across displayed launches"
          />
        </div>
      </Container>

      <section className="border-t border-white/[0.04] py-10">
        <Container maxWidth="7xl" className="w-full px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-perps-muted">
                Launched tokens
              </h2>
              <p className="mt-2 text-sm text-perps-muted-50">
                Confirmed launches created by this address.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-[260px_180px]">
              <TextField
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                icon={MagnifyingGlassIcon}
                placeholder="Search launches"
                aria-label="Search creator launches"
                className="!bg-white/[0.04] !text-perps-muted"
              />
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as LaunchpadTokenSortField)
                }
                aria-label="Sort creator launches"
                className="h-10 rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 text-sm font-medium text-perps-muted outline-none focus:border-perps-blue"
              >
                <option value="VOLUME_24H">24h volume</option>
                <option value="CURRENT_TVL">Current TVL</option>
                <option value="TVL_CHANGE_24H">24h TVL change</option>
                <option value="CREATED_AT">Newest</option>
              </select>
            </div>
          </div>
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
                    This creator&apos;s launches could not be loaded.
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
        </Container>
      </section>
    </>
  )
}
