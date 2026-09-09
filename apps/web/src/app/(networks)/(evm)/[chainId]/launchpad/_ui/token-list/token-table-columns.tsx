import { SkeletonBox, SkeletonCircle, classNames } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { getEvmChainById } from 'sushi/evm'
import {
  formatLaunchpadAge,
  formatLaunchpadAgeLabel,
  formatPercent,
  formatUsd,
} from '../../_lib/format'
import type { LaunchpadToken, LaunchpadTokenSortField } from '../../types'
import { TokenAvatar } from '../_common/token-avatar'
import { LaunchpadProviderMark } from '../providers/launchpad-provider-mark'

const NUMBER_META = {
  header: { className: 'text-right' },
  body: {
    className: 'h-20 justify-end text-right tabular-nums whitespace-nowrap',
    skeleton: <SkeletonBox className="ml-auto h-4 w-20" />,
  },
}

export function getLaunchpadTokenHref(token: LaunchpadToken): string {
  return `/${getEvmChainById(token.chainId).key}/launchpad/token/${token.address}`
}

export function getTokenTableColumns(
  sortBy: LaunchpadTokenSortField,
): ColumnDef<LaunchpadToken, unknown>[] {
  const window =
    sortBy === 'VOLUME_1H'
      ? 'h1'
      : sortBy === 'VOLUME_6H'
        ? 'h6'
        : sortBy === 'VOLUME_12H'
          ? 'h12'
          : 'h24'
  const period = `${window.slice(1)}H`

  return [
    {
      id: 'token',
      header: 'Token',
      accessorFn: (token) => token.name,
      enableSorting: false,
      size: 280,
      cell: ({ row: { original: token } }) => {
        // const chain = getEvmChainById(token.chainId)
        const provider = token.provider.includes('POOLS')
          ? 'pools.fun'
          : 'Sushi Launch'
        return (
          <div className="flex min-w-0 items-center gap-3">
            <div className="shrink-0">
              {/* <Badge
                position="bottom-right"
                className="!bottom-0 !right-0 rounded-full border-2 border-[#151A20]"
                badgeContent={
                  <span
                    role="img"
                    aria-label={`${chain.name} network`}
                    title={chain.name}
                  >
                    <NetworkIcon
                      chainId={token.chainId}
                      width={16}
                      height={16}
                    />
                  </span>
                }
              > */}
              <TokenAvatar token={token} size="md" />
              {/* </Badge> */}
            </div>
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-1.5">
                <span
                  title={token.name}
                  className="truncate font-semibold text-white lg:max-w-[180px] xl:max-w-[240px]"
                >
                  {token.name}
                </span>
                <span
                  role="img"
                  aria-label={`Launched on ${provider}`}
                  title={`Launched on ${provider}`}
                  className="shrink-0"
                >
                  <LaunchpadProviderMark
                    provider={token.provider}
                    size="sm"
                    className="!bg-transparent"
                  />
                </span>
              </div>
              <div
                title={token.symbol}
                className="mt-0.5 truncate text-xs text-perps-muted-50 lg:max-w-[180px] xl:max-w-[240px]"
              >
                {token.symbol}
              </div>
            </div>
          </div>
        )
      },
      meta: {
        body: {
          className: 'h-20',
          skeleton: (
            <div className="flex items-center gap-3">
              <SkeletonCircle radius={44} />
              <div className="flex flex-col gap-2">
                <SkeletonBox className="h-4 w-24" />
                <SkeletonBox className="h-3 w-16" />
              </div>
            </div>
          ),
        },
      },
    },
    {
      id: 'pair',
      header: 'Paired with',
      accessorFn: (token) => token.pool.quoteToken.symbol,
      enableSorting: false,
      size: 140,
      cell: ({ row: { original: token } }) => (
        <div className="flex min-w-0 items-center gap-2 text-white">
          <TokenAvatar
            token={{ ...token.pool.quoteToken, chainId: token.chainId }}
            size="xs"
          />
          <span
            title={token.pool.quoteToken.symbol}
            className="max-w-24 truncate"
          >
            {token.pool.quoteToken.symbol}
          </span>
        </div>
      ),
      meta: {
        body: {
          className: 'h-20',
          skeleton: <SkeletonBox className="h-5 w-20" />,
        },
      },
    },
    {
      id: 'change',
      header: `${period} TVL change`,
      accessorFn: (token) => token.metrics?.tvlChangePercent[window],
      enableSorting: false,
      size: 140,
      cell: ({ row: { original: token } }) => {
        const change = token.metrics?.tvlChangePercent[window]
        return (
          <span
            className={classNames(
              'font-medium tabular-nums',
              change == null || change === 0
                ? 'text-perps-muted-50'
                : change > 0
                  ? 'text-perps-green'
                  : 'text-perps-red',
            )}
          >
            {formatPercent(change)}
          </span>
        )
      },
      meta: {
        ...NUMBER_META,
        header: {
          ...NUMBER_META.header,
          description: `Change in the pool's USD liquidity over the last ${window.slice(1)} hours.`,
        },
      },
    },
    {
      id: 'marketCap',
      header: 'Market cap',
      accessorFn: (token) => token.metrics?.marketCapitalizationUsd,
      enableSorting: false,
      size: 140,
      cell: ({ row }) => (
        <span className="text-white">
          {formatUsd(row.original.metrics?.marketCapitalizationUsd)}
        </span>
      ),
      meta: NUMBER_META,
    },
    {
      id: 'volume',
      header: `${period} Volume`,
      accessorFn: (token) => token.metrics?.volumeUsd[window],
      enableSorting: false,
      size: 140,
      cell: ({ row }) => (
        <span className="text-white">
          {formatUsd(row.original.metrics?.volumeUsd[window])}
        </span>
      ),
      meta: NUMBER_META,
    },
    {
      id: 'age',
      header: 'Age',
      accessorFn: (token) => token.createdAt,
      enableSorting: false,
      size: 100,
      cell: ({ row }) => {
        const age = formatLaunchpadAge(row.original.createdAt)
        return (
          <span
            title={formatLaunchpadAgeLabel(age)}
            className="whitespace-nowrap text-perps-blue"
          >
            {age === 'now' || age === '—' ? age : `${age} ago`}
          </span>
        )
      },
      meta: NUMBER_META,
    },
  ]
}
