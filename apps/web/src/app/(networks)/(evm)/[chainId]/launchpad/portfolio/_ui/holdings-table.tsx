'use client'

import type { LaunchpadUserHoldingsType } from '@sushiswap/graph-client/data-api'
import { DataTableVirtual, SkeletonBox, classNames } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { type EvmAddress, getEvmChainById } from 'sushi/evm'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import {
  formatPercent,
  formatRawAmount,
  formatUsd,
  formatUsdChange,
  shortenAddress,
} from '../../_lib/format'
import { TokenAvatar } from '../../_ui/_common/token-avatar'
import { HolderRewardsCell } from './holder-rewards-cell'

type LaunchpadUserHolding = LaunchpadUserHoldingsType['edges'][number]['node']

export function PnlValue({
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

const NUMBER_META = {
  header: { className: 'text-right' },
  body: {
    className: 'h-[84px] justify-end text-right tabular-nums',
    skeleton: <SkeletonBox className="ml-auto h-4 w-24 rounded-md" />,
  },
}

function getHoldingsColumns(
  holder: EvmAddress | undefined,
): ColumnDef<LaunchpadUserHolding, unknown>[] {
  return [
    {
      id: 'token',
      header: 'Token',
      enableSorting: false,
      size: 280,
      cell: ({ row: { original: holding } }) => (
        <div className="flex min-w-0 items-center gap-3">
          <TokenAvatar token={holding.token} size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate font-semibold text-perps-muted">
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
      ),
      meta: {
        body: {
          className: 'h-[84px]',
          skeleton: (
            <div className="flex items-center gap-3">
              <SkeletonBox className="h-11 w-11 shrink-0 rounded-full" />
              <SkeletonBox className="h-4 w-32 rounded-md" />
            </div>
          ),
        },
      },
    },
    {
      id: 'holdings',
      header: 'Holdings',
      enableSorting: false,
      size: 170,
      cell: ({ row: { original: holding } }) => (
        <div>
          <div className="font-semibold text-perps-muted">
            {formatUsd(holding.amountUsd)}
          </div>
          <div className="mt-1 text-xs text-perps-muted-50">
            {formatRawAmount(holding.tokenAmount, holding.token.decimals, 4)}
          </div>
        </div>
      ),
      meta: NUMBER_META,
    },
    {
      id: 'pnl',
      header: 'PnL',
      enableSorting: false,
      size: 170,
      cell: ({ row: { original: holding } }) => (
        <div className="flex justify-end">
          <PnlValue pnlUsd={holding.pnlUsd} pnlPercent={holding.pnlPercent} />
        </div>
      ),
      meta: NUMBER_META,
    },
    {
      id: 'rewards',
      header: 'Pending rewards / your rate',
      enableSorting: false,
      size: 200,
      cell: ({ row: { original: holding } }) =>
        holder ? (
          <HolderRewardsCell
            key={`${holding.token.chainId}:${holder}:${holding.token.address}`}
            chainId={holding.token.chainId}
            token={holding.token}
            holder={holder}
          />
        ) : null,
      meta: { ...NUMBER_META, disableLink: true },
    },
  ]
}

export function HoldingsTable({
  holder,
  holdings,
  isLoading = false,
  isFetchingNextPage = false,
}: {
  holder?: EvmAddress
  holdings: LaunchpadUserHolding[]
  isLoading?: boolean
  isFetchingNextPage?: boolean
}): React.ReactElement {
  const columns = useMemo(() => getHoldingsColumns(holder), [holder])
  return (
    <PerpsCard className="overflow-hidden" fullWidth>
      <DataTableVirtual
        scrollMode="window"
        columns={columns}
        data={holdings}
        loading={isLoading}
        linkFormatter={({ token }) =>
          `/${getEvmChainById(token.chainId).key}/launchpad/token/${token.address}`
        }
        estimateSize={84}
        overscan={5}
        skeletonRowCount={5}
        scrollClassName="!border-white/[0.06] [&_table]:min-w-[860px] [&_table]:table-fixed [&_thead_tr]:!border-white/[0.06]"
        thClassName="!h-11 !font-medium !text-perps-muted-50"
        trClassName="!border-white/[0.06] hover:!bg-white/[0.035]"
        state={{
          pagination: { pageIndex: 0, pageSize: Math.max(holdings.length, 1) },
        }}
        testId={({ token }) => `launchpad-holding-${token.address}`}
        footer={
          <>
            <p className="border-t border-white/[0.06] px-5 py-3 text-xs text-perps-muted-50">
              Reward rates are estimates at the current distribution rate and
              can change with fee funding, token transfers, and eligible
              holdings. Rewards are paid in the quote token.
            </p>
            {isFetchingNextPage ? (
              <div
                className="border-t border-white/[0.06] px-5 py-4 text-center text-xs text-perps-muted-50"
                role="status"
              >
                Loading more holdings…
              </div>
            ) : null}
          </>
        }
      />
    </PerpsCard>
  )
}
