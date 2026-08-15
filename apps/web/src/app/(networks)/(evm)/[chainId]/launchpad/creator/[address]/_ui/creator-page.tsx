'use client'

import {
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { useCopyClipboard } from '@sushiswap/hooks'
import { Button, Container, LinkExternal, TextField } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { type EvmAddress, EvmChainId, getEvmChainById } from 'sushi/evm'
import { useEnsName } from 'wagmi'
import { formatUsd, shortenAddress } from '../../../_lib/format'
import { DEFAULT_LAUNCHPAD_TOKEN_SORT } from '../../../_lib/launchpad-feed'
import { useLaunchpadCreator } from '../../../_lib/use-launchpad-creator'
import { MetricCard } from '../../../_ui/metric-card'
import { PageHeading } from '../../../_ui/page-heading'
import { CollectionStateCard } from '../../../_ui/state-card'
import { TokenGrid } from '../../../_ui/token-grid'
import { TokenSortControls } from '../../../_ui/token-sort-controls'
import type { LaunchpadChainId } from '../../../constants'
import type { LaunchpadTokenSortField } from '../../../types'

export function CreatorPage({
  chainId,
  address,
}: {
  chainId: LaunchpadChainId
  address: EvmAddress
}) {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<LaunchpadTokenSortField>(
    DEFAULT_LAUNCHPAD_TOKEN_SORT,
  )
  const { data: ensName, isLoading: isENSNameLoading } = useEnsName({
    chainId: EvmChainId.ETHEREUM,
    address: address,
  })
  const [isCopied, staticCopy] = useCopyClipboard()
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

  const title = useMemo(() => {
    if (isENSNameLoading) return 'Loading...'
    if (ensName) return ensName
    return shortenAddress(address, 7)
  }, [address, ensName, isENSNameLoading])

  return (
    <>
      <Container maxWidth="7xl" className="w-full px-4 py-10 sm:py-14">
        <PageHeading
          title={title}
          description="Every launch below is tied to this immutable onchain creator address."
          action={
            <div className="flex gap-2">
              <Button
                variant="perps-secondary"
                size="sm"
                aria-label="Copy creator address"
                onClick={() => staticCopy(address)}
              >
                <DocumentDuplicateIcon className="h-4 w-4" />
                {isCopied ? 'Copied' : 'Copy'}
              </Button>
              <LinkExternal
                href={getEvmChainById(chainId).getAccountUrl(address)}
              >
                <Button variant="perps-secondary" size="sm" asChild>
                  Explorer
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </Button>
              </LinkExternal>
            </div>
          }
        />

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
          <MetricCard
            label="Confirmed launches"
            value={creator?.launchCount ?? 0}
          />
          <MetricCard label="Combined TVL" value={formatUsd(totalTvl)} />
          <MetricCard
            label="Combined 24h volume"
            value={formatUsd(allTimeVolume)}
          />
        </div>
      </Container>

      <section className="border-t border-white/[0.04] py-10">
        <Container maxWidth="7xl" className="w-full px-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-perps-muted">
                Launched tokens
              </h2>
              <p className="mt-2 text-sm text-perps-muted-50">
                Confirmed launches created by this address.
              </p>
            </div>
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
              <TextField
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                icon={MagnifyingGlassIcon}
                placeholder="Search launches"
                aria-label="Search creator launches"
                className="!bg-white/[0.04] !text-perps-muted"
                wrapperClassName="min-w-0 xl:w-[260px]"
              />
              <TokenSortControls
                sortBy={sortBy}
                onSortByChange={setSortBy}
                ariaLabel="Sort creator launches by"
              />
            </div>
          </div>
          <div className="mt-6">
            {isPending ? (
              <CollectionStateCard className="text-sm text-perps-muted-50">
                Loading launches…
              </CollectionStateCard>
            ) : isError ? (
              <CollectionStateCard
                description="This creator's launches could not be loaded."
                action={
                  <Button variant="perps-secondary" onClick={() => refetch()}>
                    Try again
                  </Button>
                }
              />
            ) : (
              <TokenGrid tokens={tokens} sortBy={sortBy} />
            )}
          </div>
        </Container>
      </section>
    </>
  )
}
