import { ArrowUpRightIcon } from '@heroicons/react/20/solid'
import { classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import Link from 'next/link'
import { getEvmChainById } from 'sushi/evm'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import type { LaunchpadToken, LaunchpadTokenSortField } from '../types'
import {
  formatPercent,
  formatUsd,
  getSelectedMetric,
  shortenAddress,
} from './format'
import { StatusPill } from './status-pill'
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
  const selectedMetric = getSelectedMetric(token, sortBy)
  const tvlChange = token.metrics?.tvlChangePercent.h24
  const href = manage
    ? `/${chainKey}/launchpad/manage/${token.address}`
    : `/${chainKey}/launchpad/token/${token.address}`

  return (
    <PerpsCard
      className="group h-full overflow-hidden transition duration-200 hover:bg-white/[0.035]"
      fullHeight
      fullWidth
    >
      <div className="h-px bg-gradient-to-r from-transparent via-perps-blue/70 to-transparent" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <TokenAvatar symbol={token.symbol} />
            <div className="min-w-0">
              <Link
                href={href}
                className="flex items-center gap-1 font-semibold text-perps-muted hover:text-perps-blue"
              >
                <span className="truncate">{token.name}</span>
                <ArrowUpRightIcon className="h-4 w-4 shrink-0 opacity-0 transition group-hover:opacity-100" />
              </Link>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-perps-muted-50">
                <span>{token.symbol}</span>
                <span>·</span>
                <NetworkIcon chainId={token.chainId} width={13} height={13} />
                <span>Robinhood</span>
              </div>
            </div>
          </div>
          <StatusPill status={token.indexingStatus} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-perps-muted-50">Price</div>
            <div className="mt-1 font-semibold text-perps-muted">
              {formatUsd(token.metrics?.priceUsd)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-perps-muted-50">
              {selectedMetric.label}
            </div>
            <div
              className={classNames(
                'mt-1 font-semibold text-perps-muted',
                selectedMetric.change !== undefined &&
                  selectedMetric.change !== null &&
                  selectedMetric.change >= 0 &&
                  'text-emerald-600 dark:text-emerald-400',
                selectedMetric.change !== undefined &&
                  selectedMetric.change !== null &&
                  selectedMetric.change < 0 &&
                  'text-red',
              )}
            >
              {selectedMetric.value}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs">
          <Link
            href={`/${chainKey}/launchpad/creator/${token.creator}`}
            className="text-perps-muted-50 transition hover:text-perps-blue"
          >
            by {shortenAddress(token.creator)}
          </Link>
          <span
            className={classNames(
              'font-medium',
              tvlChange !== null && tvlChange !== undefined && tvlChange >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red',
            )}
          >
            {formatPercent(tvlChange)} TVL · 24h
          </span>
        </div>
      </div>
    </PerpsCard>
  )
}
