'use client'

import { ArrowUpRightIcon } from '@heroicons/react/20/solid'
import { SkeletonBox } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/network-icon'
import Link from 'next/link'
import { getEvmChainById } from 'sushi/evm'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import {
  formatLaunchpadPriceUsd,
  formatUsd,
  getSelectedMetric,
  shortenAddress,
} from '../_lib/format'
import { launchpadProviderHasCapability } from '../_lib/launchpad-provider'
import type { LaunchpadToken, LaunchpadTokenSortField } from '../types'
import { LaunchpadCreatorLink } from './launchpad-creator-link'
import { LaunchpadProviderBadge } from './launchpad-provider-badge'
import { PriceSensitiveText } from './price-sensitive-text'
import { TokenAvatar } from './token-avatar'

export function TokenCardSkeleton() {
  return (
    <PerpsCard className="min-h-[249px] overflow-hidden" fullWidth>
      <div className="h-px bg-gradient-to-r from-transparent via-perps-blue/20 to-transparent" />
      <div className="p-4">
        <div className="flex items-center gap-3">
          <SkeletonBox className="h-14 w-14 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1">
            <SkeletonBox className="h-5 w-3/5 rounded-md" />
            <SkeletonBox className="mt-2 h-3 w-24 rounded-sm" />
          </div>
        </div>

        <div className="mt-4">
          <SkeletonBox className="h-3 w-8 rounded-sm" />
          <SkeletonBox className="mt-2 h-6 w-24 rounded-md" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-3">
          <div>
            <SkeletonBox className="h-3 w-10 rounded-sm" />
            <SkeletonBox className="mt-2 h-4 w-16 rounded-sm" />
          </div>
          <div className="flex flex-col items-end">
            <SkeletonBox className="h-3 w-16 rounded-sm" />
            <SkeletonBox className="mt-2 h-4 w-20 rounded-sm" />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <SkeletonBox className="h-3 w-24 rounded-sm" />
          <SkeletonBox className="h-3 w-28 rounded-sm" />
        </div>
      </div>
    </PerpsCard>
  )
}

export function TokenCard({
  token,
  sortBy = 'VOLUME_24H',
  manage = false,
}: {
  token: LaunchpadToken
  sortBy?: LaunchpadTokenSortField
  manage?: boolean
}) {
  const chain = getEvmChainById(token.chainId)
  const chainKey = chain.key
  const selectedMetric = getSelectedMetric(
    token,
    sortBy === 'MARKET_CAPITALIZATION' || sortBy === 'CURRENT_TVL'
      ? 'VOLUME_24H'
      : sortBy,
  )
  const href =
    manage && launchpadProviderHasCapability(token.provider, 'manage')
      ? `/${chainKey}/launchpad/manage/${token.address}`
      : `/${chainKey}/launchpad/token/${token.address}`

  return (
    <PerpsCard
      className="group relative h-full cursor-pointer overflow-hidden transition duration-200 hover:bg-white/[0.035]"
      fullHeight
      fullWidth
    >
      <div className="h-px bg-gradient-to-r from-transparent via-perps-blue/70 to-transparent" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <TokenAvatar
              token={token}
              size="lg"
              badge={
                <LaunchpadProviderBadge
                  provider={token.provider}
                  variant="mark"
                />
              }
            />
            <div className="min-w-0">
              <Link
                href={href}
                aria-label={`${manage ? 'Manage' : 'View'} ${token.name}`}
                className="flex items-center gap-1 text-lg font-semibold text-perps-muted transition after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-perps-blue/50 group-hover:text-perps-blue"
              >
                <span className="truncate">{token.name}</span>
                <ArrowUpRightIcon className="h-4 w-4 shrink-0 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100" />
              </Link>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-perps-muted-50">
                <span>{token.symbol}</span>
                <span>·</span>
                <NetworkIcon chainId={token.chainId} width={13} height={13} />
                <span>{chain.name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-[11px] font-medium uppercase tracking-wide text-perps-muted-50">
            MC
          </div>
          <div className="mt-1 text-xl font-semibold tracking-tight text-perps-muted tabular-nums">
            {formatUsd(token.metrics?.marketCapitalizationUsd)}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-3">
          <div>
            <div className="text-xs text-perps-muted-50">Price</div>
            <div className="mt-1 text-sm font-medium text-perps-muted">
              <PriceSensitiveText price={token.metrics?.priceUsd}>
                {formatLaunchpadPriceUsd(token.metrics?.priceUsd)}
              </PriceSensitiveText>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-perps-muted-50">
              {selectedMetric.label}
            </div>
            <div className="mt-1 text-sm font-medium text-perps-muted">
              {selectedMetric.value}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <LaunchpadCreatorLink
            token={token}
            className="relative z-10 text-perps-muted-50 transition hover:text-perps-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-perps-blue/50"
          >
            by {shortenAddress(token.creator)}
          </LaunchpadCreatorLink>
          <div className="flex items-center gap-1">
            <span className="text-perps-muted">
              {formatUsd(token.metrics?.currentTvlUsd)}
            </span>
            <span className="text-perps-muted-50">of Liquidity</span>
          </div>
        </div>
      </div>
    </PerpsCard>
  )
}
