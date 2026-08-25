'use client'

import {
  ArrowRightIcon,
  ChartPieIcon,
  WalletIcon,
} from '@heroicons/react/24/outline'
import type { LaunchpadUserHoldingsType } from '@sushiswap/graph-client/data-api'
import { Button, Container, LinkInternal, classNames } from '@sushiswap/ui'
import { useRouter } from 'next/navigation'
import { type KeyboardEvent, useMemo } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { type EvmAddress, getEvmChainById } from 'sushi/evm'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import {
  formatPercent,
  formatRawAmount,
  formatUsd,
  formatUsdChange,
  shortenAddress,
} from '../../_lib/format'
import { LaunchpadProviderBadge } from '../../_ui/launchpad-provider-badge'
import { MetricStrip, MetricStripItem } from '../../_ui/metric-strip'
import { PageHeading } from '../../_ui/page-heading'
import { CollectionStateCard } from '../../_ui/state-card'
import { TokenAvatar } from '../../_ui/token-avatar'
import type { LaunchpadChainId } from '../../constants'
import {
  useLaunchpadUserHoldings,
  useLaunchpadUserStats,
} from '../_lib/use-launchpad-portfolio'
import {
  HoldingsTableSkeleton,
  PortfolioStatsSkeleton,
} from './portfolio-skeleton'

type LaunchpadUserHolding = LaunchpadUserHoldingsType['edges'][number]['node']

function PnlValue({
  pnlUsd,
  pnlPercent,
  large = false,
}: {
  pnlUsd: number | null
  pnlPercent: number | null
  large?: boolean
}) {
  if (pnlUsd === null || pnlPercent === null) {
    return (
      <span
        className={classNames(
          'font-semibold tracking-tight text-perps-muted',
          large ? 'text-lg' : 'text-sm',
        )}
      >
        -
      </span>
    )
  }

  return (
    <div
      className={classNames(
        'flex items-baseline gap-1',
        pnlUsd > 0 && 'text-emerald-400',
        pnlUsd < 0 && 'text-red',
        pnlUsd === 0 && 'text-perps-muted',
      )}
    >
      <span
        className={classNames(
          'font-semibold tracking-tight',
          large ? 'text-lg' : 'text-sm',
        )}
      >
        {formatUsdChange(pnlUsd)}
      </span>
      <span className={'text-xs font-medium'}>{formatPercent(pnlPercent)}</span>
    </div>
  )
}

function HoldingRow({
  holding,
  onOpen,
}: {
  holding: LaunchpadUserHolding
  onOpen: (address: EvmAddress) => void
}) {
  function handleKeyDown(event: KeyboardEvent<HTMLTableRowElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    onOpen(holding.token.address)
  }

  return (
    <tr
      role="link"
      tabIndex={0}
      aria-label={`View ${holding.token.name}`}
      onClick={() => onOpen(holding.token.address)}
      onKeyDown={handleKeyDown}
      className="group cursor-pointer border-b border-white/[0.06] transition last:border-b-0 hover:bg-white/[0.035] focus-visible:bg-white/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-perps-blue/50"
    >
      <td className="h-[84px] px-5">
        <div className="flex min-w-0 items-center gap-3">
          <TokenAvatar
            token={holding.token}
            size="md"
            badge={
              <LaunchpadProviderBadge
                provider={holding.token.provider}
                variant="mark"
                className="!h-5 !w-5"
              />
            }
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate font-semibold text-perps-muted transition group-hover:text-perps-blue">
                {holding.token.name}
              </span>
              {holding.isCreator ? (
                <span className="shrink-0 rounded-full bg-perps-blue/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-perps-blue">
                  Creator
                </span>
              ) : null}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-perps-muted-50">
              <span>{holding.token.symbol}</span>
              <span>·</span>
              <span>{shortenAddress(holding.token.address)}</span>
            </div>
          </div>
        </div>
      </td>
      <td className="h-[84px] px-5 text-right">
        <div className="font-semibold text-perps-muted">
          {formatUsd(holding.amountUsd)}
        </div>
        <div className="mt-1 text-xs text-perps-muted-50">
          {formatRawAmount(holding.tokenAmount, holding.token.decimals, 4)}
        </div>
      </td>
      <td className="h-[84px] px-5">
        <div className="flex justify-end">
          <PnlValue pnlUsd={holding.pnlUsd} pnlPercent={holding.pnlPercent} />
        </div>
      </td>
    </tr>
  )
}

function HoldingsTable({
  chainId,
  holdings,
  isFetchingNextPage,
}: {
  chainId: LaunchpadChainId
  holdings: LaunchpadUserHolding[]
  isFetchingNextPage: boolean
}) {
  const chainKey = getEvmChainById(chainId).key
  const router = useRouter()

  function openToken(address: EvmAddress) {
    router.push(`/${chainKey}/launchpad/token/${address}`)
  }

  return (
    <PerpsCard className="overflow-hidden" fullWidth>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] table-fixed">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className="w-1/2 px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-perps-muted-50">
                Token
              </th>
              <th className="w-1/4 px-5 py-3 text-right text-[11px] font-medium uppercase tracking-wide text-perps-muted-50">
                Holdings
              </th>
              <th className="w-1/4 px-5 py-3 text-right text-[11px] font-medium uppercase tracking-wide text-perps-muted-50">
                PnL
              </th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => (
              <HoldingRow
                key={holding.token.address}
                holding={holding}
                onOpen={openToken}
              />
            ))}
          </tbody>
        </table>
      </div>
      {isFetchingNextPage ? (
        <div
          className="border-t border-white/[0.06] px-5 py-4 text-center text-xs text-perps-muted-50"
          role="status"
        >
          Loading more holdings…
        </div>
      ) : null}
    </PerpsCard>
  )
}

export function PortfolioPage({ chainId }: { chainId: LaunchpadChainId }) {
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
                    chainId={chainId}
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
