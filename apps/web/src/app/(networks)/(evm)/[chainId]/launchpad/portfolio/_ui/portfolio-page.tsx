'use client'

import {
  ArrowRightIcon,
  ChartPieIcon,
  WalletIcon,
} from '@heroicons/react/24/outline'
import type { LaunchpadUserHoldingsType } from '@sushiswap/graph-client/data-api'
import {
  Button,
  Container,
  LinkInternal,
  SkeletonBox,
  classNames,
} from '@sushiswap/ui'
import { useRouter } from 'next/navigation'
import { type KeyboardEvent, useMemo } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useAccount } from 'src/lib/wallet'
import { type EvmAddress, getEvmChainById } from 'sushi/evm'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import {
  formatPercent,
  formatRawAmount,
  formatUsd,
  formatUsdChange,
  shortenAddress,
} from '../../_ui/format'
import { PageHeading } from '../../_ui/page-heading'
import { TokenAvatar } from '../../_ui/token-avatar'
import type { LaunchpadChainId } from '../../constants'
import {
  useLaunchpadUserHoldings,
  useLaunchpadUserStats,
} from '../../hooks/use-launchpad-portfolio'

type LaunchpadUserHolding = LaunchpadUserHoldingsType['edges'][number]['node']

const HOLDING_SKELETONS = [
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
] as const

function PnlValue({
  pnlUsd,
  pnlPercent,
  large = false,
}: {
  pnlUsd: number
  pnlPercent: number
  large?: boolean
}) {
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

function PortfolioStatsSkeleton() {
  return (
    <PerpsCard className="overflow-hidden" fullWidth>
      <div className="grid sm:grid-cols-3">
        {['Holdings USD', 'Tokens held', 'PnL'].map((label, index) => (
          <div
            key={label}
            className={classNames(
              'border-white/[0.06] px-4 py-4 sm:px-5',
              index > 0 && 'border-t sm:border-l sm:border-t-0',
            )}
          >
            <div className="text-[11px] font-medium uppercase tracking-wide text-perps-muted-50">
              {label}
            </div>
            <SkeletonBox className="mt-2 h-6 w-24 rounded-md" />
          </div>
        ))}
      </div>
    </PerpsCard>
  )
}

function HoldingsTableSkeleton() {
  return (
    <PerpsCard className="overflow-hidden" fullWidth>
      <div className="overflow-x-auto">
        <table
          className="w-full min-w-[680px] table-fixed"
          aria-label="Loading portfolio holdings"
          aria-busy="true"
        >
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
            {HOLDING_SKELETONS.map((skeleton) => (
              <tr
                key={skeleton}
                className="border-b border-white/[0.06] last:border-b-0"
              >
                <td className="h-[84px] px-5">
                  <div className="flex items-center gap-3">
                    <SkeletonBox className="h-11 w-11 shrink-0 rounded-full" />
                    <div className="min-w-0 flex-1">
                      <SkeletonBox className="h-4 w-32 rounded-md" />
                      <SkeletonBox className="mt-2 h-3 w-44 rounded-sm" />
                    </div>
                  </div>
                </td>
                <td className="h-[84px] px-5">
                  <SkeletonBox className="ml-auto h-4 w-24 rounded-md" />
                  <SkeletonBox className="ml-auto mt-2 h-3 w-16 rounded-sm" />
                </td>
                <td className="h-[84px] px-5">
                  <SkeletonBox className="ml-auto h-4 w-28 rounded-md" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PerpsCard>
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

  function handleRowKeyDown(
    event: KeyboardEvent<HTMLTableRowElement>,
    address: EvmAddress,
  ) {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    openToken(address)
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
              <tr
                key={holding.token.address}
                role="link"
                tabIndex={0}
                aria-label={`View ${holding.token.name}`}
                onClick={() => openToken(holding.token.address)}
                onKeyDown={(event) =>
                  handleRowKeyDown(event, holding.token.address)
                }
                className="group cursor-pointer border-b border-white/[0.06] transition last:border-b-0 hover:bg-white/[0.035] focus-visible:bg-white/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-perps-blue/50"
              >
                <td className="h-[84px] px-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <TokenAvatar token={holding.token} size="md" />
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
                    {formatRawAmount(
                      holding.tokenAmount,
                      holding.token.decimals,
                      4,
                    )}
                  </div>
                </td>
                <td className="h-[84px] px-5">
                  <div className="flex justify-end">
                    <PnlValue
                      pnlUsd={holding.pnlUsd}
                      pnlPercent={holding.pnlPercent}
                    />
                  </div>
                </td>
              </tr>
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
          <PerpsCard
            className="grid min-h-72 place-items-center p-8 text-center"
            fullWidth
          >
            <div>
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-perps-blue/10 text-perps-blue">
                <WalletIcon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-perps-muted">
                Connect your wallet
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-perps-muted-50">
                Connect an EVM wallet to view its launchpad holdings and PnL.
              </p>
              <ConnectButton
                namespace="evm"
                variant="perps-default"
                className="mt-5"
              />
            </div>
          </PerpsCard>
        ) : (
          <div className="mt-7">
            {isStatsPending ? (
              <PortfolioStatsSkeleton />
            ) : isStatsError || !stats ? (
              <PerpsCard className="p-6 text-center" fullWidth>
                <p className="text-sm text-perps-muted-50">
                  Portfolio stats could not be loaded.
                </p>
                <Button
                  variant="perps-secondary"
                  size="sm"
                  className="mt-4"
                  onClick={() => refetchStats()}
                >
                  Try again
                </Button>
              </PerpsCard>
            ) : (
              <PerpsCard className="overflow-hidden" fullWidth>
                <div className="grid sm:grid-cols-3">
                  <div className="border-white/[0.06] px-4 py-4 sm:px-5">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-perps-muted-50">
                      Total Holdings
                    </div>
                    <div className="mt-1.5 text-lg font-semibold text-perps-muted">
                      {formatUsd(stats.totalHoldingsUsd)}
                    </div>
                  </div>
                  <div className="border-t border-white/[0.06] px-4 py-4 sm:border-l sm:border-t-0 sm:px-5">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-perps-muted-50">
                      Tokens Held
                    </div>
                    <div className="mt-1.5 text-lg font-semibold text-perps-muted">
                      {stats.totalTokensHeld.toLocaleString()}
                    </div>
                  </div>
                  <div className="border-t border-white/[0.06] px-4 py-4 sm:border-l sm:border-t-0 sm:px-5">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-perps-muted-50">
                      PnL
                    </div>
                    <div className="mt-1.5">
                      <PnlValue
                        pnlUsd={stats.totalPnlUsd}
                        pnlPercent={stats.totalPnlPercent}
                        large
                      />
                    </div>
                  </div>
                </div>
              </PerpsCard>
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
                <PerpsCard
                  className="grid min-h-64 place-items-center p-8 text-center"
                  fullWidth
                >
                  <div>
                    <p className="text-sm text-perps-muted-50">
                      Your holdings could not be loaded.
                    </p>
                    <Button
                      variant="perps-secondary"
                      className="mt-4"
                      onClick={() => refetchHoldings()}
                    >
                      Try again
                    </Button>
                  </div>
                </PerpsCard>
              ) : rows.length === 0 ? (
                <PerpsCard
                  className="grid min-h-64 place-items-center p-8 text-center"
                  fullWidth
                >
                  <div>
                    <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/[0.05] text-perps-muted-50">
                      <ChartPieIcon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-semibold text-perps-muted">
                      No launchpad holdings yet
                    </h3>
                    <p className="mt-1 text-sm text-perps-muted-50">
                      Tokens held by this wallet will appear here.
                    </p>
                    <LinkInternal href={`/${chainKey}/launchpad`}>
                      <Button
                        asChild
                        variant="perps-secondary"
                        className="mt-5"
                        icon={ArrowRightIcon}
                        iconPosition="end"
                      >
                        Discover tokens
                      </Button>
                    </LinkInternal>
                  </div>
                </PerpsCard>
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
