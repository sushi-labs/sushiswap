import { ArrowUpRightIcon } from '@heroicons/react/20/solid'
import { classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import Link from 'next/link'
import { getEvmChainById } from 'sushi/evm'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import type { LaunchpadToken, LaunchpadTokenSortField } from '../types'
import {
  formatUsd,
  formatUsdChange,
  getSelectedMetric,
  liquidityChange24hUsd,
  shortenAddress,
} from './format'
import { TokenAvatar } from './token-avatar'

export function TokenCard({
  token,
  sortBy = 'VOLUME_24H',
  manage = false,
}: {
  token: LaunchpadToken
  sortBy?: LaunchpadTokenSortField
  manage?: boolean
}) {
  const chainKey = getEvmChainById(token.chainId).key
  const volumeMetric = getSelectedMetric(
    token,
    sortBy.startsWith('VOLUME_') ? sortBy : 'VOLUME_24H',
  )
  const tvlChangeUsd = liquidityChange24hUsd({
    currentTvlUsd: token.metrics?.currentTvlUsd ?? null,
    tvlChangePercent24h: token.metrics?.tvlChangePercent.h24 ?? null,
    launchedAt: new Date(token.createdAt),
  })
  const href = manage
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
            <TokenAvatar token={token} size="lg" />
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
                <span>Robinhood</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-[11px] font-medium uppercase tracking-wide text-perps-muted-50">
            FDV
          </div>
          <div className="mt-1 text-xl font-semibold tracking-tight text-perps-muted">
            {formatUsd(token.metrics?.fullyDilutedValuationUsd)}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-3">
          <div>
            <div className="text-xs text-perps-muted-50">Price</div>
            <div className="mt-1 text-sm font-medium text-perps-muted">
              {token.metrics?.priceUsd === null ||
              token.metrics?.priceUsd === undefined
                ? '—'
                : `$${token.metrics.priceUsd.toPrecision(4)}`}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-perps-muted-50">
              {volumeMetric.label}
            </div>
            <div className="mt-1 text-sm font-medium text-perps-muted">
              {volumeMetric.value}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <Link
            href={`/${chainKey}/launchpad/creator/${token.creator}`}
            className="relative z-10 text-perps-muted-50 transition hover:text-perps-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-perps-blue/50"
          >
            by {shortenAddress(token.creator)}
          </Link>
          <span
            className={classNames(
              'font-medium text-perps-muted',
              tvlChangeUsd !== null && tvlChangeUsd > 0 && '!text-emerald-400',
              tvlChangeUsd !== null && tvlChangeUsd < 0 && '!text-red',
            )}
          >
            {formatUsdChange(tvlChangeUsd)} TVL · 24h
          </span>
        </div>
      </div>
    </PerpsCard>
  )
}
