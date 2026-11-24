'use client'

import { Slot } from '@radix-ui/react-slot'
import type { SushiSwapChainId, Token } from '@sushiswap/graph-client/data-api'
import {
  Card,
  CardHeader,
  CardTitle,
  DataTableSortMenu,
  ResponsiveDataTable,
  SkeletonText,
} from '@sushiswap/ui'
import { type Row, type SortingState, flexRender } from '@tanstack/react-table'
import Link from 'next/link'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { useTokens } from 'src/lib/hooks/api/use-tokens'
import { getEvmChainById } from 'sushi/evm'
import {
  FDV_COLUMN,
  PRICE_CHANGE_1D_COLUMN,
  PRICE_COLUMN,
  SPARKLINE_COLUMN,
  TOKENS_NAME_COLUMN,
} from './columns'
import { useTokenFilters } from './tokens-filters-provider'

const COLUMNS = [
  TOKENS_NAME_COLUMN,
  PRICE_COLUMN,
  PRICE_CHANGE_1D_COLUMN,
  FDV_COLUMN,
  SPARKLINE_COLUMN,
]

const SORT_OPTIONS = [
  { id: 'marketCapUSD', label: 'FDV' },
  { id: 'price', label: 'Price' },
  { id: 'priceChangePercentage1d', label: '1 day' },
]

function getTokenHref(row: Token): string {
  return `/${getEvmChainById(row.token.chainId).key}/token/${row.token.address}`
}

interface TokensTableProps {
  chainId: SushiSwapChainId
  onRowClick?(row: Token): void
}

export function TokensTable({
  chainId,
  onRowClick,
}: TokensTableProps): ReactNode {
  const { tokenSymbols } = useTokenFilters()

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'marketCapUSD', desc: true },
  ])

  const { data: tokens, isLoading } = useTokens({
    chainId,
  })

  const rowRenderer = useCallback(
    (row: Row<Token>, rowNode: ReactNode) => {
      if (onRowClick)
        return (
          <Slot
            className="cursor-pointer"
            onClick={() => onRowClick?.(row.original)}
          >
            {rowNode}
          </Slot>
        )
      return rowNode
    },
    [onRowClick],
  )

  const data = useMemo(() => {
    if (!tokens) return []

    if (!tokenSymbols.length) return tokens.data

    const tokenSymbolsSet = new Set([
      ...tokenSymbols.map((symbol) => symbol.toLowerCase()),
    ])

    return tokens.data.filter(({ token }) => {
      if (!token) return false
      const tokenSymbol = token.symbol?.toLowerCase() ?? ''
      const tokenName = token.name?.toLowerCase() ?? ''

      for (const prefix of tokenSymbolsSet) {
        if (tokenSymbol.startsWith(prefix) || tokenName.startsWith(prefix)) {
          return true
        }
      }
      return false
    })
  }, [tokens, tokenSymbols])

  return (
    <Card className="!bg-transparent md:!bg-secondary !border-transparent md:!border-accent">
      <CardHeader className="!px-0 md:!px-6">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="shrink-0">
            {isLoading ? (
              <div className="!w-28 !h-[18px]">
                <SkeletonText />
              </div>
            ) : (
              <span>
                Tokens{' '}
                <span className="text-muted-foreground text-sm font-normal">
                  ({tokens?.count ?? 0})
                </span>
              </span>
            )}
          </CardTitle>
          <DataTableSortMenu
            label="tokens"
            options={SORT_OPTIONS}
            sorting={sorting}
            onSortingChange={setSorting}
            className="md:hidden"
          />
        </div>
      </CardHeader>
      <ResponsiveDataTable
        breakpoint="md"
        sorting={sorting}
        onSortingChange={setSorting}
        loading={isLoading}
        linkFormatter={getTokenHref}
        columns={COLUMNS}
        data={data}
        desktop={{ rowRenderer, estimateSize: 70, linkScroll: true }}
        mobile={{
          rowRenderer: (row) => (
            <TokenMobileRow row={row} onRowClick={onRowClick} />
          ),
        }}
      />
    </Card>
  )
}

function TokenMobileRow({
  row,
  onRowClick,
}: Pick<TokensTableProps, 'onRowClick'> & { row: Row<Token> }): ReactNode {
  const [name, price, change, fdv, trend] = row.getVisibleCells()

  return (
    <Link
      href={getTokenHref(row.original)}
      shallow={true}
      onClick={onRowClick && (() => onRowClick(row.original))}
      className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
    >
      <Card className="p-4">
        <div className="flex items-center justify-between gap-3">
          {flexRender(name.column.columnDef.cell, name.getContext())}
          <div className="w-20 shrink-0">
            {flexRender(trend.column.columnDef.cell, trend.getContext())}
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
          {[price, change, fdv].map((cell) => (
            <div key={cell.id} className="min-w-0">
              <dt className="mb-1 text-muted-foreground">
                {typeof cell.column.columnDef.header === 'string'
                  ? cell.column.columnDef.header
                  : null}
              </dt>
              <dd className="truncate text-sm">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </dd>
            </div>
          ))}
        </dl>
      </Card>
    </Link>
  )
}
