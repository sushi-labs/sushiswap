'use client'

import { CheckIcon } from '@heroicons/react-v1/solid'
import {
  ArrowLeftIcon,
  BeakerIcon,
  BookOpenIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import {
  Button,
  ClipboardController,
  Container,
  LinkExternal,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  classNames,
  useBreakpoint,
} from '@sushiswap/ui'
import { DiscordIcon } from '@sushiswap/ui/icons/discord-icon'
import { GithubIcon } from '@sushiswap/ui/icons/github-icon'
import { MediumIcon } from '@sushiswap/ui/icons/medium-icon'
import { TelegramIcon } from '@sushiswap/ui/icons/telegram-icon'
import { XIcon } from '@sushiswap/ui/icons/x-icon'
import Link from 'next/link'
import { useRef } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { getEvmChainById } from 'sushi/evm'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import {
  formatLaunchpadPriceUsd,
  formatRawAmount,
  formatUsd,
  formatUsdChange,
  liquidityChange24hUsd,
  shortenAddress,
} from '../../../_lib/format'
import { launchpadProviderHasCapability } from '../../../_lib/launchpad-provider'
import { useLaunchpadToken } from '../../../_lib/use-launchpad-token'
import { DetailList } from '../../../_ui/detail-list'
import {
  LaunchpadCreatorButton,
  LaunchpadCreatorLink,
} from '../../../_ui/launchpad-creator-link'
import { LaunchpadProviderBadge } from '../../../_ui/launchpad-provider-badge'
import { MetricStrip, MetricStripItem } from '../../../_ui/metric-strip'
import { PriceSensitiveText } from '../../../_ui/price-sensitive-text'
import { PageState } from '../../../_ui/state-card'
import { StatusPill } from '../../../_ui/status-pill'
import { TokenAvatar } from '../../../_ui/token-avatar'
import type { LaunchpadChainId } from '../../../constants'
import { PriceChart, type PriceChartData } from './price-chart'
import { SwapPanel } from './swap-panel'
import { TokenDetailSkeleton } from './token-detail-skeleton'
import { TradeHistory } from './trade-history'

interface MetadataLink {
  kind: string
  url: string
  label: string | null
}

function metadataLinkLabel(link: MetadataLink): string {
  if (link.label?.trim()) return link.label.trim()

  switch (link.kind.trim().toLowerCase()) {
    case 'homepage':
    case 'site':
    case 'website':
      return 'Website'
    case 'x':
    case 'twitter':
      return 'X'
    case 'docs':
    case 'documentation':
      return 'Docs'
    case 'discord':
      return 'Discord'
    case 'github':
      return 'GitHub'
    case 'medium':
      return 'Medium'
    case 'telegram':
      return 'Telegram'
    default:
      return link.kind
        .replaceAll(/[-_]+/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase())
  }
}

function MetadataLinkIcon({
  kind,
  className,
}: {
  kind: string
  className?: string
}) {
  switch (kind.trim().toLowerCase()) {
    case 'homepage':
    case 'site':
    case 'website':
      return <HomeIcon className={className} />
    case 'x':
    case 'twitter':
      return <XIcon className={className} />
    case 'discord':
      return <DiscordIcon className={className} />
    case 'github':
      return <GithubIcon className={className} />
    case 'medium':
      return <MediumIcon className={className} />
    case 'telegram':
      return <TelegramIcon className={className} />
    case 'docs':
    case 'documentation':
      return <BookOpenIcon className={className} />
    default:
      return <LinkIcon className={className} />
  }
}

function CopyableExplorerAddress({
  label,
  address,
  href,
  visibleCharacters,
  linkClassName = 'font-medium text-perps-blue hover:underline',
}: {
  label: string
  address: EvmAddress
  href: string
  visibleCharacters: number
  linkClassName?: string
}) {
  return (
    <div className="flex items-center gap-1">
      <span>{label}</span>
      <ClipboardController hideTooltip>
        {({ setCopied, isCopied }) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild onClick={() => setCopied(address)}>
                {isCopied ? (
                  <CheckIcon className="mb-[1px] h-3.5 w-3.5 cursor-pointer text-emerald-400" />
                ) : (
                  <DocumentDuplicateIcon className="mb-[1px] h-3.5 w-3.5 cursor-pointer text-perps-blue" />
                )}
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Copy address</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </ClipboardController>
      <LinkExternal
        href={href}
        aria-label={`View ${label.toLowerCase()} address on block explorer`}
        className={linkClassName}
      >
        {shortenAddress(address, visibleCharacters)}
      </LinkExternal>
    </div>
  )
}

function MetadataLinks({
  links,
  placement,
}: {
  links: MetadataLink[]
  placement: 'header' | 'about'
}) {
  if (links.length === 0) return null

  if (placement === 'header') {
    return (
      <div className="flex flex-wrap gap-2">
        {links.map((item) => {
          const label = metadataLinkLabel(item)

          return (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              title={label}
              key={`${item.kind}:${item.url}`}
            >
              <Button
                asChild
                variant="perps-secondary"
                size="sm"
                className="!w-9 !min-w-9 !px-0 [&>div]:items-center [&>div]:justify-center"
              >
                <MetadataLinkIcon kind={item.kind} className="h-4 w-4" />
                <span className="sr-only">{label}</span>
              </Button>
            </a>
          )
        })}
      </div>
    )
  }

  return (
    <div className="mt-5 flex flex-wrap gap-2 border-t border-white/[0.06] pt-4">
      {links.map((item) => {
        const label = metadataLinkLabel(item)

        return (
          <a
            key={`${item.kind}:${item.url}`}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            title={label}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-perps-muted transition hover:border-perps-blue/30 hover:bg-perps-blue/10 hover:text-perps-blue"
          >
            <MetadataLinkIcon
              kind={item.kind}
              className="h-4 w-4 shrink-0 text-perps-blue"
            />
            <span className="sr-only">{label}</span>
          </a>
        )
      })}
    </div>
  )
}

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
  const { isLg } = useBreakpoint('lg')
  const priceChartDataRef = useRef<PriceChartData>({
    chainId,
    decimals: token?.decimals ?? 0,
    initialSupply: token?.initialSupply ?? '0',
    tokenAddress: address,
    symbol: token?.symbol ?? '',
    price: token?.metrics?.priceUsd,
  })

  if (isTokenPending) {
    return <TokenDetailSkeleton />
  }

  if (isTokenError) {
    return (
      <PageState
        title="Could not load this launch"
        description="The launchpad API did not return a usable response."
        action={
          <Button variant="perps-secondary" onClick={() => refetchToken()}>
            Try again
          </Button>
        }
      />
    )
  }

  if (!token) {
    return (
      <PageState
        icon={<BeakerIcon className="mx-auto h-10 w-10 text-perps-muted-50" />}
        title="Launch not found"
        description="This token is not present in the launchpad catalog."
        action={
          <Button asChild variant="perps-secondary" icon={ArrowLeftIcon}>
            <Link href={`/${chainKey}/launchpad`}>Back to launchpad</Link>
          </Button>
        }
      />
    )
  }

  priceChartDataRef.current = {
    chainId,
    decimals: token.decimals,
    initialSupply: token.initialSupply,
    tokenAddress: address,
    symbol: token.symbol,
    price: token.metrics?.priceUsd,
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
      value: formatLaunchpadPriceUsd(metrics?.priceUsd),
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
      changeDetail: formatUsdChange(tvlChangeUsd),
      changeValue: tvlChangeUsd,
      changeLabel: '24H',
    },
    {
      label: '24h volume',
      value: formatUsd(metrics?.volumeUsd.h24),
      detail: 'Launch pool volume',
    },
  ]
  const supportsLockedPositions = launchpadProviderHasCapability(
    token.provider,
    'lockedPositions',
  )
  const showLockedPositions =
    supportsLockedPositions && token.positions.length > 0

  return (
    <Container
      maxWidth="8xl"
      className="w-full px-4 pb-20 lg:pb-14 pt-6 sm:pt-8"
    >
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
          <TokenAvatar token={token} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="truncate text-2xl font-semibold tracking-tight text-perps-muted sm:text-3xl">
                {token.name}
              </h1>
              <span className="text-lg font-medium text-perps-muted-50 mt-0.5">
                ${token.symbol}
              </span>
              <StatusPill status={token.indexingStatus} />
              <LaunchpadProviderBadge provider={token.provider} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-perps-muted-50">
              <CopyableExplorerAddress
                label="Launched by"
                address={token.creator}
                href={chain.getAccountUrl(token.creator)}
                visibleCharacters={5}
                linkClassName="text-perps-muted-50 transition hover:text-perps-blue"
              />
              <span>·</span>
              <CopyableExplorerAddress
                label="Token"
                address={token.address}
                href={chain.getTokenUrl(token.address)}
                visibleCharacters={6}
              />
            </div>
          </div>
        </div>
        <MetadataLinks links={token.metadata.links} placement="header" />
      </div>

      <div className="mt-6">
        <MetricStrip>
          {marketStats.map((stat, index) => (
            <MetricStripItem
              key={stat.label}
              index={index}
              label={stat.label}
              valueClassName="flex flex-wrap items-end gap-1"
              value={
                <>
                  {stat.label === 'Price' ? (
                    <PriceSensitiveText price={metrics?.priceUsd}>
                      {stat.value}
                    </PriceSensitiveText>
                  ) : (
                    stat.value
                  )}
                  {stat.changeDetail && stat.changeValue ? (
                    <span
                      className={classNames(
                        'text-xs mb-1',
                        stat.changeValue !== undefined &&
                          stat.changeValue !== null &&
                          stat.changeValue > 0 &&
                          '!text-emerald-400',
                        stat.changeValue !== undefined &&
                          stat.changeValue !== null &&
                          stat.changeValue < 0 &&
                          '!text-red',
                      )}
                    >
                      {stat.changeDetail}{' '}
                      <span className="text-perps-muted-50 font-normal">
                        ({stat.changeLabel})
                      </span>
                    </span>
                  ) : null}
                </>
              }
              detail={stat.detail}
            />
          ))}
        </MetricStrip>
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_480px]">
        <div className="min-w-0 space-y-4">
          <PriceChart
            key={`${chainId}:${address}`}
            dataRef={priceChartDataRef}
          />
          <TradeHistory token={token} />
        </div>

        <aside className="min-w-0 space-y-4 lg:sticky lg:top-[72px]">
          {isLg ? (
            <SwapPanel token={token} />
          ) : (
            <Sheet>
              <SheetTrigger asChild className="bg-perps-background">
                <Button
                  type="button"
                  className="fixed inset-x-4 bottom-6 z-40 h-14 rounded-full text-base font-semibold"
                  variant="perps-long"
                >
                  Trade {token.symbol}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="max-h-[100svh] overflow-y-auto rounded-t-2xl border-border p-0 pb-6 !bg-perps-background"
              >
                <SheetHeader className="pr-8 !text-left !space-y-0">
                  <SheetTitle>Buy/Sell {token.symbol}</SheetTitle>
                  <SheetDescription aria-describedby={undefined} />
                </SheetHeader>
                <div className="mt-4">
                  <SwapPanel token={token} />
                </div>
              </SheetContent>
            </Sheet>
          )}

          <PerpsCard className="p-5" fullWidth>
            <h2 className="text-lg font-semibold text-perps-muted">
              About {token.name}
            </h2>
            <p className="mt-3 text-sm leading-6 text-perps-muted-50">
              {token.metadata.description ??
                'This creator has not added a description yet.'}
            </p>
            <MetadataLinks links={token.metadata.links} placement="about" />
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
              <TokenAvatar token={token} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="text-xs text-perps-muted-50">Created by</div>
                <LaunchpadCreatorLink
                  token={token}
                  className="mt-0.5 block truncate text-sm font-medium text-perps-blue hover:underline"
                >
                  {shortenAddress(token.creator, 6)}
                </LaunchpadCreatorLink>
              </div>
              <LaunchpadCreatorButton token={token} />
            </div>
          </PerpsCard>

          <PerpsCard className="p-5" fullWidth>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-perps-muted">
                Launch details
              </h2>
            </div>
            <DetailList
              className="mt-5"
              valueClassName="max-w-[68%]"
              items={[
                [
                  'Supply',
                  `${formatRawAmount(token.initialSupply, token.decimals, 0)} ${token.symbol}`,
                ],
                ['Pool fee', `${token.pool.feeTier / 10_000}%`],
                ['Starting FDV', formatUsd(Number(token.initialFdvUsd))],
                ...(supportsLockedPositions
                  ? [['Liquidity', 'Single maximum-bound position']]
                  : []),
              ].map(([label, value]) => ({ label, value }))}
            />
          </PerpsCard>

          {showLockedPositions ? (
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
          ) : null}
        </aside>
      </div>
    </Container>
  )
}
