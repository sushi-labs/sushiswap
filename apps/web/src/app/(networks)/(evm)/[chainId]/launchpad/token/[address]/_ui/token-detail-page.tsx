'use client'

import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  BeakerIcon,
  DocumentDuplicateIcon,
  LinkIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'
import {
  Button,
  ClipboardController,
  Container,
  LinkExternal,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  classNames,
} from '@sushiswap/ui'
import Link from 'next/link'
import type { EvmAddress } from 'sushi/evm'
import { getEvmChainById } from 'sushi/evm'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import {
  formatRawAmount,
  formatUsd,
  formatUsdChange,
  liquidityChange24hUsd,
  shortenAddress,
} from '../../../_ui/format'
import { StatusPill } from '../../../_ui/status-pill'
import { TokenAvatar } from '../../../_ui/token-avatar'
import type { LaunchpadChainId } from '../../../constants'
import { useLaunchpadToken } from '../../../hooks/use-launchpad-data'
import { PriceChart } from './price-chart'
import { SwapPanel } from './swap-panel'
import { TradeHistory } from './trade-history'

export function TokenDetailPage({
  chainId,
  address,
}: {
  chainId: LaunchpadChainId
  address: EvmAddress
}) {
  const chain = getEvmChainById(chainId)
  const chainKey = chain.key
  const {
    data: token,
    isError: isTokenError,
    isPending: isTokenPending,
    refetch: refetchToken,
  } = useLaunchpadToken(chainId, address)

  if (isTokenPending) {
    return (
      <Container maxWidth="lg" className="w-full px-4 py-20">
        <PerpsCard className="p-8 text-center" fullWidth>
          <BeakerIcon className="mx-auto h-10 w-10 animate-pulse text-perps-muted-50" />
          <h1 className="mt-4 text-xl font-semibold text-perps-muted">
            Loading launch
          </h1>
        </PerpsCard>
      </Container>
    )
  }

  if (isTokenError) {
    return (
      <Container maxWidth="lg" className="w-full px-4 py-20">
        <PerpsCard className="p-8 text-center" fullWidth>
          <h1 className="text-2xl font-semibold text-perps-muted">
            Could not load this launch
          </h1>
          <p className="mt-2 text-sm text-perps-muted-50">
            The launchpad API did not return a usable response.
          </p>
          <Button
            variant="perps-secondary"
            className="mt-6"
            onClick={() => refetchToken()}
          >
            Try again
          </Button>
        </PerpsCard>
      </Container>
    )
  }

  if (!token) {
    return (
      <Container maxWidth="lg" className="w-full px-4 py-20">
        <PerpsCard className="p-8 text-center" fullWidth>
          <BeakerIcon className="mx-auto h-10 w-10 text-perps-muted-50" />
          <h1 className="mt-4 text-2xl font-semibold text-perps-muted">
            Launch not found
          </h1>
          <p className="mt-2 text-sm text-perps-muted-50">
            This token is not present in the launchpad catalog.
          </p>
          <Button
            asChild
            variant="perps-secondary"
            className="mt-6"
            icon={ArrowLeftIcon}
          >
            <Link href={`/${chainKey}/launchpad`}>Back to launchpad</Link>
          </Button>
        </PerpsCard>
      </Container>
    )
  }

  const metrics = token.metrics
  const tvlChangePercent = metrics?.tvlChangePercent.h24
  const tvlChangeUsd = liquidityChange24hUsd({
    currentTvlUsd: metrics?.currentTvlUsd ?? null,
    tvlChangePercent24h: tvlChangePercent ?? null,
    launchedAt: new Date(token.createdAt),
  })
  const marketStats = [
    {
      label: 'Price',
      value: `$${metrics?.priceUsd != null ? metrics.priceUsd.toPrecision(5) : '$-'}`,
      detail: metrics?.isStale ? 'Data delayed' : 'Live pool price',
    },
    {
      label: 'FDV',
      value: formatUsd(metrics?.fullyDilutedValuationUsd),
      detail: '1B fixed supply',
    },
    {
      label: 'Liquidity',
      value: formatUsd(metrics?.currentTvlUsd),
      detail: 'Launch pool liquidity',
    },
    {
      label: '24h volume',
      value: formatUsd(metrics?.volumeUsd.h24),
      detail: 'Launch pool volume',
    },
    {
      label: '24h liquidity',
      value: formatUsdChange(tvlChangeUsd),
      detail: 'TVL change',
      change: tvlChangeUsd,
    },
  ]

  return (
    <Container maxWidth="8xl" className="w-full px-4 pb-14 pt-6 sm:pt-8">
      <div className="mb-5 flex items-center gap-2 text-xs text-perps-muted-50">
        <Link
          href={`/${chainKey}/launchpad`}
          className="transition hover:text-perps-blue"
        >
          Launches
        </Link>
        <span>/</span>
        <span className="font-medium text-perps-muted">{token.symbol}</span>
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <TokenAvatar symbol={token.symbol} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="truncate text-2xl font-semibold tracking-tight text-perps-muted sm:text-3xl">
                {token.name}
              </h1>
              <span className="text-lg font-medium text-perps-muted-50 mt-0.5">
                ${token.symbol}
              </span>
              <StatusPill status={token.indexingStatus} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-perps-muted-50">
              <div className="flex items-center gap-1">
                <span>Launched by</span>
                <ClipboardController hideTooltip>
                  {({ setCopied }) => (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DocumentDuplicateIcon
                            className="mb-[1px] h-3.5 w-3.5 cursor-pointer text-perps-blue"
                            onClick={() => setCopied(token.creator)}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Copy address</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </ClipboardController>
                <LinkExternal
                  href={chain.getAccountUrl(token.creator)}
                  aria-label="View creator address on block explorer"
                  className="text-perps-muted-50 transition hover:text-perps-blue"
                >
                  {shortenAddress(token.creator, 5)}
                </LinkExternal>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <span>Token</span>
                <ClipboardController hideTooltip>
                  {({ setCopied }) => (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DocumentDuplicateIcon
                            className="mb-[1px] h-3.5 w-3.5 cursor-pointer text-perps-blue"
                            onClick={() => setCopied(token.address)}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Copy address</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </ClipboardController>
                <LinkExternal
                  href={chain.getTokenUrl(token.address)}
                  className="font-medium text-perps-blue hover:underline"
                >
                  {shortenAddress(token.address, 6)}
                </LinkExternal>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {token.metadata.links.map((item) => (
            <Button
              key={`${item.kind}:${item.url}`}
              asChild
              variant="perps-secondary"
              size="sm"
            >
              <a href={item.url} target="_blank" rel="noreferrer">
                <LinkIcon className="h-4 w-4" />
                {item.label ?? item.kind}
              </a>
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <PerpsCard className="overflow-hidden" fullWidth>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
            {marketStats.map((stat, index) => (
              <div
                key={stat.label}
                className={classNames(
                  'px-4 py-4 sm:px-5',
                  index > 0 && 'border-l border-white/[0.06]',
                  index > 1 && 'border-t border-white/[0.06] sm:border-t-0',
                  index > 2 && 'sm:border-t lg:border-t-0',
                )}
              >
                <div className="text-[11px] font-medium uppercase tracking-wide text-perps-muted-50">
                  {stat.label}
                </div>
                <div
                  className={classNames(
                    'mt-1.5 text-lg font-semibold text-perps-muted',
                    stat.change !== undefined &&
                      stat.change !== null &&
                      stat.change > 0 &&
                      '!text-emerald-400',
                    stat.change !== undefined &&
                      stat.change !== null &&
                      stat.change < 0 &&
                      '!text-red',
                  )}
                >
                  {stat.value}
                </div>
                <div className="mt-1 text-[11px] text-perps-muted-50">
                  {stat.detail}
                </div>
              </div>
            ))}
          </div>
        </PerpsCard>
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_480px]">
        <div className="min-w-0 space-y-4">
          <PriceChart
            chainId={chainId}
            tokenAddress={address}
            symbol={token.symbol}
            price={token.metrics?.priceUsd}
          />
          <TradeHistory token={token} />
        </div>

        <aside className="min-w-0 space-y-4 lg:sticky lg:top-[72px]">
          <SwapPanel token={token} />

          <PerpsCard className="p-5" fullWidth>
            <h2 className="text-lg font-semibold text-perps-muted">
              About {token.name}
            </h2>
            <p className="mt-3 text-sm leading-6 text-perps-muted-50">
              {token.metadata.description ??
                'This creator has not added a description yet.'}
            </p>
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
              <TokenAvatar symbol={token.symbol} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="text-xs text-perps-muted-50">Created by</div>
                <Link
                  href={`/${chainKey}/launchpad/creator/${token.creator}`}
                  className="mt-0.5 block truncate text-sm font-medium text-perps-blue hover:underline"
                >
                  {shortenAddress(token.creator, 6)}
                </Link>
              </div>
              <Button asChild variant="perps-secondary" size="xs">
                <Link href={`/${chainKey}/launchpad/creator/${token.creator}`}>
                  Profile
                </Link>
              </Button>
            </div>
          </PerpsCard>

          <PerpsCard className="p-5" fullWidth>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-perps-muted">
                Launch details
              </h2>
            </div>
            <div className="mt-5 space-y-4">
              {[
                [
                  'Supply',
                  `${formatRawAmount(token.initialSupply, token.decimals, 0)} ${token.symbol}`,
                ],
                ['Pool fee', `${token.pool.feeTier / 10_000}%`],
                [
                  'Curve',
                  token.curvePreset
                    ? `${token.curvePreset.id} · ${token.curvePreset.version}`
                    : 'Custom ranges',
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-4 text-sm"
                >
                  <span className="text-perps-muted-50">{label}</span>
                  <span className="max-w-[68%] text-right font-medium text-perps-muted">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </PerpsCard>

          <PerpsCard className="overflow-hidden" fullWidth>
            <div className="flex items-center gap-2 border-b border-white/[0.06] p-5">
              <h2 className="font-semibold text-perps-muted">
                Locked positions
              </h2>
            </div>
            <div className="divide-y divide-white/[0.06]">
              {token.positions.map((position) => (
                <div key={position.positionIndex} className="p-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-perps-muted">
                      Position #{position.positionId}
                    </span>
                    <span className="text-xs text-emerald-400">Locked</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                    <div>
                      <div className="text-perps-muted-50">Tick range</div>
                      <div className="mt-1 text-perps-muted">
                        {position.tickLower.toLocaleString()} →{' '}
                        {position.tickUpper.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-perps-muted-50">Allocation</div>
                      <div className="mt-1 truncate text-perps-muted">
                        {formatRawAmount(
                          position.desiredAmount,
                          token.decimals,
                          0,
                        )}{' '}
                        {token.symbol}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PerpsCard>
        </aside>
      </div>
    </Container>
  )
}
