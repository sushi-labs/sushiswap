import { SkeletonBox } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/network-icon'
import Link from 'next/link'
import { useMemo } from 'react'
import { getEvmChainById } from 'sushi/evm'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import {
  formatLaunchpadAge,
  formatLaunchpadAgeLabel,
  formatUsd,
  getSelectedMetric,
} from '../_lib/format'
import { launchpadProviderHasCapability } from '../_lib/launchpad-provider'
import type { LaunchpadToken, LaunchpadTokenSortField } from '../types'
import { LaunchpadProviderBadge } from './launchpad-provider-badge'
import { QuickBuy } from './quick-buy'
import { TokenAvatar } from './token-avatar'

export function TokenCardSkeleton() {
  return (
    <PerpsCard className="h-full overflow-hidden" fullHeight fullWidth>
      <div className="h-px bg-gradient-to-r from-transparent via-perps-blue/20 to-transparent" />
      <div className="p-3">
        <div className="flex flex-col items-center gap-1">
          <div className="grid w-full grid-cols-[1fr_auto_1fr] items-start">
            <div className="relative col-start-2 row-start-1">
              <SkeletonBox className="h-24 w-24 shrink-0 rounded-full" />
              <SkeletonBox className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full" />
            </div>
            <SkeletonBox className="col-start-3 row-start-1 h-4 w-8 justify-self-end rounded-sm" />
          </div>
          <div className="flex w-full min-w-0 flex-col items-center">
            <SkeletonBox className="h-5 w-3/5 rounded-md" />
            <SkeletonBox className="mt-1 h-4 w-1/3 rounded-sm" />
            <SkeletonBox className="mt-1.5 h-3 w-2/5 rounded-sm" />
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-0.5 border-t border-white/[0.06] pt-3">
          {[
            ['market-cap', 'w-16', 'w-14'],
            ['volume', 'w-12', 'w-12'],
            ['liquidity', 'w-14', 'w-16'],
          ].map(([stat, labelWidth, valueWidth]) => (
            <div
              key={stat}
              className="flex items-center justify-between py-0.5"
            >
              <SkeletonBox className={`h-3 ${labelWidth} rounded-sm`} />
              <SkeletonBox className={`h-3 ${valueWidth} rounded-sm`} />
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {['10', '25', '50', '100'].map((amount) => (
            <SkeletonBox key={amount} className="h-8 rounded-lg" />
          ))}
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
  const age = formatLaunchpadAge(token.createdAt)
  const volumeMetric = getSelectedMetric(
    token,
    sortBy.startsWith('VOLUME_') ? sortBy : 'VOLUME_24H',
  )
  const stats = useMemo(
    () => [
      {
        label: 'Market Cap',
        value: formatUsd(token.metrics?.marketCapitalizationUsd),
      },
      { label: volumeMetric.label, value: volumeMetric.value },
      { label: 'Liquidity', value: formatUsd(token.metrics?.currentTvlUsd) },
    ],
    [token, volumeMetric],
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
      <div className="p-3">
        <div className="flex flex-col items-center gap-1">
          <div className="grid w-full grid-cols-[1fr_auto_1fr] items-start">
            <div className="col-start-2 row-start-1">
              <TokenAvatar
                token={token}
                size="2xl"
                badge={
                  <LaunchpadProviderBadge
                    provider={token.provider}
                    variant="mark"
                  />
                }
              />
            </div>
            <div
              title={formatLaunchpadAgeLabel(age)}
              className="col-start-3 row-start-1 shrink-0 justify-self-end text-right text-xs tabular-nums text-perps-muted-50"
            >
              {age}
            </div>
          </div>
          <div className="flex w-full min-w-0 flex-1 flex-col items-center text-center">
            <div className="flex w-full min-w-0 justify-center text-center">
              <Link
                href={href}
                aria-label={`${manage ? 'Manage' : 'View'} ${token.name}`}
                title={token.name}
                className="mx-auto flex max-w-full min-w-0 items-center justify-center text-base font-semibold text-perps-muted transition after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-perps-blue/50 group-hover:text-perps-blue"
              >
                <span className="block min-w-0 truncate">{token.name}</span>
              </Link>
            </div>
            <div
              title={token.symbol}
              className="max-w-full truncate text-xs text-perps-muted-50"
            >
              {token.symbol}
            </div>
            <div className="mt-1 flex max-w-full items-center justify-center gap-1.5 text-[10px] text-perps-muted-50">
              <span
                role="img"
                aria-label={`${chain.name} network`}
                title={chain.name}
                className="shrink-0"
              >
                <NetworkIcon
                  chainId={token.chainId}
                  width={12}
                  height={12}
                  aria-hidden="true"
                />
              </span>
              <span className="min-w-0 truncate">{chain.name}</span>
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-col border-t gap-0.5 border-white/[0.06] pt-3">
          {stats.map((stat) => (
            <div
              key={`${stat.label}-${token.address}`}
              className="flex min-w-0 justify-between"
            >
              <div className="truncate text-[11px] font-medium tracking-wide text-perps-muted-50">
                {stat.label}
              </div>
              <div className="truncate text-xs font-semibold tabular-nums tracking-tight text-perps-muted">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <QuickBuy token={token} />
        </div>
      </div>
    </PerpsCard>
  )
}
