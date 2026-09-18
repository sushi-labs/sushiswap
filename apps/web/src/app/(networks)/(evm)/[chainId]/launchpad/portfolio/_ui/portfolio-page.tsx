'use client'

import {
  ArrowRightIcon,
  ChartPieIcon,
  WalletIcon,
} from '@heroicons/react/24/outline'
import { Button, Container, LinkInternal } from '@sushiswap/ui'
import { useMemo } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { type LaunchpadV2ChainId, getEvmChainById } from 'sushi/evm'
import { formatUsd } from '../../_lib/format'
import { PageHeading } from '../../_ui/_common/page-heading'
import { CollectionStateCard } from '../../_ui/_common/state-card'
import { MetricStrip, MetricStripItem } from '../../_ui/metrics/metric-strip'
import {
  useLaunchpadUserHoldings,
  useLaunchpadUserStats,
} from '../_lib/use-launchpad-portfolio'
import { HoldingsTable, PnlValue } from './holdings-table'
import {
  HoldingsTableSkeleton,
  PortfolioStatsSkeleton,
} from './portfolio-skeleton'

export function PortfolioPage({ chainId }: { chainId: LaunchpadV2ChainId }) {
  const chainKey = getEvmChainById(chainId).key
  const address = useAccount('evm')
  const {
    data: stats,
    isError: isStatsError,
    isPending: isStatsPending,
    refetch: refetchStats,
  } = useLaunchpadUserStats({ chainId, address })
  const {
    data: holdings,
    fetchNextPage,
    isError: isHoldingsError,
    isFetchingNextPage,
    isPending: isHoldingsPending,
    refetch: refetchHoldings,
  } = useLaunchpadUserHoldings({ chainId, address })
  const rows = useMemo(
    () => holdings?.edges.map((edge) => edge.node) ?? [],
    [holdings?.edges],
  )

  return (
    <>
      <Container maxWidth="7xl" className="w-full px-4 py-10 sm:py-14">
        <PageHeading
          title="Portfolio"
          description="Track the launchpad tokens held and see your performance at a glance."
        />

        {!address ? (
          <CollectionStateCard
            size="large"
            icon={
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-perps-blue/10 text-perps-blue">
                <WalletIcon className="h-5 w-5" />
              </span>
            }
            title="Connect your wallet"
            titleClassName="text-lg"
            description="Connect an EVM wallet to view its launchpad holdings and PnL."
            descriptionClassName="mx-auto max-w-md"
            action={<ConnectButton namespace="evm" variant="perps-default" />}
          />
        ) : (
          <div className="mt-7">
            {isStatsPending ? (
              <PortfolioStatsSkeleton />
            ) : isStatsError || !stats ? (
              <CollectionStateCard
                size="compact"
                description="Portfolio stats could not be loaded."
                action={
                  <Button
                    variant="perps-secondary"
                    size="sm"
                    onClick={() => refetchStats()}
                  >
                    Try again
                  </Button>
                }
              />
            ) : (
              <MetricStrip columns={3}>
                <MetricStripItem
                  columns={3}
                  index={0}
                  label="Total Holdings"
                  value={formatUsd(stats.totalHoldingsUsd)}
                />
                <MetricStripItem
                  columns={3}
                  index={1}
                  label="Tokens Held"
                  value={stats.totalTokensHeld.toLocaleString()}
                />
                <MetricStripItem
                  columns={3}
                  index={2}
                  label="PnL"
                  value={
                    <PnlValue
                      pnlUsd={stats.totalPnlUsd}
                      pnlPercent={stats.totalPnlPercent}
                      large
                    />
                  }
                />
              </MetricStrip>
            )}
          </div>
        )}
      </Container>

      {address ? (
        <section className="border-t border-white/[0.04] py-10">
          <Container maxWidth="7xl" className="w-full px-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-perps-muted">
                  Holdings
                </h2>
                <p className="mt-2 text-sm text-perps-muted-50">
                  Active launchpad tokens held.
                </p>
              </div>
              {!isHoldingsPending && !isHoldingsError ? (
                <div className="text-sm text-perps-muted-50">
                  {holdings.totalCount.toLocaleString()}{' '}
                  {holdings.totalCount === 1 ? 'token' : 'tokens'}
                </div>
              ) : null}
            </div>

            <div className="mt-6">
              {isHoldingsPending ? (
                <HoldingsTableSkeleton />
              ) : isHoldingsError ? (
                <CollectionStateCard
                  description="Your holdings could not be loaded."
                  action={
                    <Button
                      variant="perps-secondary"
                      onClick={() => refetchHoldings()}
                    >
                      Try again
                    </Button>
                  }
                />
              ) : rows.length === 0 ? (
                <CollectionStateCard
                  icon={
                    <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/[0.05] text-perps-muted-50">
                      <ChartPieIcon className="h-5 w-5" />
                    </span>
                  }
                  title="No launchpad holdings yet"
                  description="Tokens held by this wallet will appear here."
                  action={
                    <LinkInternal href={`/${chainKey}/launchpad`}>
                      <Button
                        asChild
                        variant="perps-secondary"
                        icon={ArrowRightIcon}
                        iconPosition="end"
                      >
                        Discover tokens
                      </Button>
                    </LinkInternal>
                  }
                />
              ) : (
                <InfiniteScroll
                  dataLength={rows.length}
                  next={() => fetchNextPage()}
                  hasMore={holdings.pageInfo.hasNextPage}
                  loader={null}
                  className="!overflow-visible"
                >
                  <HoldingsTable
                    holder={address}
                    holdings={rows}
                    isFetchingNextPage={isFetchingNextPage}
                  />
                </InfiniteScroll>
              )}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  )
}
