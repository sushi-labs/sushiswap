import { SkeletonBox, SkeletonCircle, classNames } from '@sushiswap/ui'
import Link from 'next/link'
import { useMemo } from 'react'
import { TriangleIcon } from 'src/app/(cms)/components/icons/triangle-icon'
import { SUSHI, getEvmChainById } from 'sushi/evm'
import { isAddressEqual } from 'viem'
import {
  formatLaunchpadAge,
  formatLaunchpadAgeLabel,
  formatPercent,
  formatUsd,
  getSelectedMetric,
} from '../../_lib/format'
import { launchpadProviderHasCapability } from '../../_lib/launchpad-provider'
import type { LaunchpadToken, LaunchpadTokenSortField } from '../../types'
import { PercentChange } from '../_common/percent-change'
import { TokenAvatar } from '../_common/token-avatar'

const CARD_CLASS_NAME =
  'group relative flex h-full rounded-2xl cursor-pointer flex-col overflow-hidden bg-[#58585C]/[0.12] transition border border-white/[0.31] duration-200 hover:bg-white/[0.035] hover:-translate-y-0.5'

export function TokenCardSkeleton(): React.ReactElement {
  return (
    <div className={CARD_CLASS_NAME}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-perps-blue/20 to-transparent" />
      <div className="relative aspect-[1/1] w-full shrink-0 overflow-hidden rounded-xl">
        <SkeletonBox className="absolute inset-0 !rounded-none" />
      </div>
      <div className="flex flex-1 flex-col p-4 pb-2.5">
        <div className="flex h-7 items-center">
          <SkeletonBox className="h-6 w-3/4" />
        </div>
        <div className="flex h-5 items-center">
          <SkeletonBox className="h-4 w-1/2" />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3">
          <SkeletonBox className="my-0.5 h-4 w-[70px] max-w-full" />
          <SkeletonBox className="my-0.5 h-4 w-[70px] max-w-full" />
        </div>
        <div className="flex min-w-0 items-center gap-1.5 mt-0.5">
          <SkeletonBox className="h-3 w-16 max-w-full" />
          <SkeletonCircle radius={20} />
          <SkeletonBox className="h-3 w-8 max-w-full" />
        </div>
        <div className="mt-auto flex items-center justify-end gap-3 pt-3">
          <SkeletonBox className="h-3 w-8 max-w-full" />
        </div>
      </div>
    </div>
  )
}

export function TokenCard({
  token,
  isStockPair,
  sortBy = 'VOLUME_24H',
  manage = false,
}: {
  token: LaunchpadToken
  isStockPair: boolean
  sortBy?: LaunchpadTokenSortField
  manage?: boolean
}): React.ReactElement {
  const chain = getEvmChainById(token.chainId)
  const chainKey = chain.key
  const age = formatLaunchpadAge(token.createdAt)
  const volumeMetric = getSelectedMetric(
    token,
    sortBy.startsWith('VOLUME_') ? sortBy : 'VOLUME_24H',
  )
  const href =
    manage && launchpadProviderHasCapability(token.provider, 'manage')
      ? `/${chainKey}/launchpad/manage/${token.address}`
      : `/${chainKey}/launchpad/token/${token.address}`

  const [borderColor, hoverBorderColor] = useMemo(() => {
    if (isStockPair) {
      return ['via-[#CCFF00]/80', 'hover:border-[#CCFF00]/80']
    }
    if (
      isAddressEqual(
        token.pool.quoteToken.address,
        SUSHI[token.chainId].address,
      )
    ) {
      return ['via-pink/80', 'hover:border-pink/80 ']
    }
    return ['via-perps-blue/80', 'hover:border-perps-blue/80 ']
  }, [token, isStockPair])
  const pricePctChange = token.metrics?.priceChangePercent24h

  return (
    <div className={classNames(CARD_CLASS_NAME, hoverBorderColor)}>
      <div
        className={classNames(
          'h-px bg-gradient-to-r from-transparent z-[1] absolute w-full top-0 left-1/2 -translate-x-1/2',
          borderColor,
          'to-transparent',
        )}
      />
      {/* @dev: for when we support more networks */}
      {/* <Badge
        position="bottom-right"
        className="pointer-events-none !bottom-2 !right-2 rounded-full"
        badgeContent={
          <span role="img" aria-label={`${chain.name} network`}>
            <NetworkIcon chainId={token.chainId} width={14} height={14} />
          </span>
        }
      > */}
      <TokenAvatar token={token} size="card" />
      {/* </Badge> */}
      <div className="flex flex-1 flex-col p-4 pb-2.5">
        <div className="flex items-center gap-2">
          <Link
            href={href}
            prefetch={manage ? 'auto' : true}
            aria-label={`${manage ? 'Manage' : 'View'} ${token.name}`}
            title={token.name}
            className="block truncate text-lg font-bold text-white transition after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-perps-blue/50"
          >
            {token.name}
          </Link>
          <PercentChange value={pricePctChange} className="pt-0.5" />
        </div>
        <div
          title={token.symbol}
          className="truncate text-xs leading-5 text-perps-muted-50"
        >
          {token.symbol}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3">
          <div
            title="Market capitalization"
            className="flex items-baseline gap-1 whitespace-nowrap"
          >
            <span className="font-semibold tabular-nums text-white text-sm">
              {formatUsd(token.metrics?.marketCapitalizationUsd)}
            </span>
            <span className="text-xs text-perps-muted-50">MC</span>
          </div>
          <div
            title={volumeMetric.label}
            className="flex items-baseline gap-1 whitespace-nowrap"
          >
            <span className="font-semibold tabular-nums text-white text-sm">
              {volumeMetric.value}
            </span>
            <span className="text-xs text-perps-muted-50">Vol</span>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-1.5 text-xs leading-6 mt-0.5 text-perps-muted-50">
          <span className="shrink-0">Paired with</span>
          <TokenAvatar
            token={{ ...token.pool.quoteToken, chainId: token.chainId }}
            size="xs"
          />
          <span
            title={token.pool.quoteToken.symbol}
            className="truncate font-semibold"
          >
            {token.pool.quoteToken.symbol}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-end gap-3 pt-3 text-xs">
          <span
            title={formatLaunchpadAgeLabel(age)}
            className="shrink-0 tabular-nums text-perps-blue"
          >
            {age === 'now' || age === '—' ? age : `${age} ago`}
          </span>
        </div>
      </div>
    </div>
  )
}
