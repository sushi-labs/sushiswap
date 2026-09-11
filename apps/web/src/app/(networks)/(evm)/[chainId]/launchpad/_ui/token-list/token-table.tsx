'use client'

import { DataTableVirtual, SkeletonBox, SkeletonCircle } from '@sushiswap/ui'
import { type Row, flexRender } from '@tanstack/react-table'
import Link from 'next/link'
import { useMemo } from 'react'
import { MobileTable } from '~evm/perps/_ui/trade-tables/_common'
import type { LaunchpadToken, LaunchpadTokenSortField } from '../../types'
import { CollectionStateCard } from '../_common/state-card'
import { TokenPagination, type TokenPaginationProps } from './token-pagination'
import {
  getLaunchpadTokenHref,
  getTokenTableColumns,
} from './token-table-columns'

interface TokenTableProps extends TokenPaginationProps {
  tokens: LaunchpadToken[]
  sortBy: LaunchpadTokenSortField
  isLoading: boolean
}

export function TokenTable({
  tokens,
  sortBy,
  isLoading,
  ...pagination
}: TokenTableProps): React.ReactElement {
  const columns = useMemo(() => getTokenTableColumns(sortBy), [sortBy])

  if (!isLoading && tokens.length === 0) {
    return (
      <CollectionStateCard
        title="No launches found"
        description="Try another name, symbol, token address, or creator."
      />
    )
  }

  return (
    <div aria-label="Launches table" aria-busy={isLoading}>
      <div className="hidden lg:block">
        <DataTableVirtual
          scrollMode="window"
          columns={columns}
          data={tokens}
          loading={isLoading}
          linkFormatter={getLaunchpadTokenHref}
          estimateSize={80}
          overscan={5}
          skeletonRowCount={8}
          scrollClassName="!border-white/[0.06] [&_thead_tr]:!border-white/[0.06]"
          thClassName="!h-11 !font-medium !text-perps-muted-50"
          trClassName="!border-white/[0.06] hover:!bg-white/[0.03]"
          state={{
            pagination: { pageIndex: 0, pageSize: Math.max(tokens.length, 1) },
          }}
          testId={(token) => `launchpad-token-${token.id}`}
          footer={<TokenPagination {...pagination} />}
        />
      </div>
      <div className="lg:hidden">
        <MobileTable
          scrollMode="window"
          columns={columns}
          data={tokens}
          isLoading={isLoading}
          sorting={[]}
          isExpandedOverride
          rowRenderer={(row) => <TokenMobileRow row={row} />}
          skeleton={<TokenMobileSkeleton />}
          footer={<TokenPagination {...pagination} />}
        />
      </div>
    </div>
  )
}

function TokenMobileRow({
  row,
}: { row: Row<LaunchpadToken> }): React.ReactElement {
  function renderCell(id: string): React.ReactNode {
    const cell = row.getVisibleCells().find((cell) => cell.column.id === id)
    return cell
      ? flexRender(cell.column.columnDef.cell, cell.getContext())
      : null
  }

  return (
    <Link
      href={getLaunchpadTokenHref(row.original)}
      aria-label={`View ${row.original.name}`}
      className="block min-w-0 border-b border-white/[0.06] py-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-perps-blue"
    >
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0 flex-1">{renderCell('token')}</div>
        <div className="shrink-0 text-xs">{renderCell('age')}</div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-perps-muted-50">
        <span>Paired with</span>
        {renderCell('pair')}
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2">
        {['change', 'marketCap', 'volume'].map((id) => {
          const header = row
            .getVisibleCells()
            .find((cell) => cell.column.id === id)?.column.columnDef.header
          return (
            <div key={id} className="min-w-0">
              <dt className="mb-1 text-[11px] text-perps-muted-50">
                {typeof header === 'string' ? header : null}
              </dt>
              <dd className="truncate tabular-nums">{renderCell(id)}</dd>
            </div>
          )
        })}
      </dl>
    </Link>
  )
}

function TokenMobileSkeleton(): React.ReactElement {
  return (
    <div role="status" aria-label="Loading launches">
      {['first', 'second', 'third'].map((key) => (
        <div
          key={key}
          aria-hidden="true"
          className="border-b border-white/[0.06] py-4"
        >
          <div className="flex items-center gap-3">
            <SkeletonCircle radius={44} />
            <div className="flex flex-1 flex-col gap-2">
              <SkeletonBox className="h-4 w-24" />
              <SkeletonBox className="h-3 w-16" />
            </div>
            <SkeletonBox className="h-3 w-12" />
          </div>
          <SkeletonBox className="mt-3 h-5 w-32" />
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['change', 'marketCap', 'volume'].map((metric) => (
              <div key={metric}>
                <SkeletonBox className="h-3 w-16" />
                <SkeletonBox className="mt-1 h-5 w-20 max-w-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
