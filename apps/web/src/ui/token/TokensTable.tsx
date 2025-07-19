'use client'

import { Slot } from '@radix-ui/react-slot'
import type { Token } from '@sushiswap/graph-client/data-api'
import {
  Card,
  CardHeader,
  CardTitle,
  DataTable,
  SkeletonText,
} from '@sushiswap/ui'
import type {
  ColumnDef,
  Row,
  SortingState,
  TableState,
} from '@tanstack/react-table'
import React, {
  type FC,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useTokens } from 'src/lib/hooks'
import { type SushiSwapChainId, getEvmChainById } from 'sushi/evm'
import { useTokenFilters } from './TokensFiltersProvider'
import {
  FDV_COLUMN,
  PRICE_CHANGE_1D_COLUMN,
  PRICE_COLUMN,
  SPARKLINE_COLUMN,
  TOKENS_NAME_COLUMN,
} from './columns'

const COLUMNS = [
  TOKENS_NAME_COLUMN,
  PRICE_COLUMN,
  PRICE_CHANGE_1D_COLUMN,
  FDV_COLUMN,
  SPARKLINE_COLUMN,
] as ColumnDef<Token, unknown>[]

interface TokensTableProps {
  chainId: SushiSwapChainId
  onRowClick?(row: Token): void
}

export const TokensTable: FC<TokensTableProps> = ({ chainId, onRowClick }) => {
  const { tokenSymbols } = useTokenFilters()

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'marketCapUSD', desc: true },
  ])

  const { data: tokens, isLoading } = useTokens({
    chainId,
  })

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: tokens?.count ?? 0,
      },
    }
  }, [tokens?.count, sorting])

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
    <Card>
      <CardHeader>
        <CardTitle>
          {isLoading ? (
            <div className="!w-28 !h-[18px]">
              <SkeletonText />
            </div>
          ) : (
            <span>
              Tokens{' '}
              <span className="text-gray-400 dark:text-slate-500">
                ({tokens?.count ?? 0})
              </span>
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <DataTable
        state={state}
        onSortingChange={setSorting}
        loading={isLoading}
        linkFormatter={(row) =>
          `/${getEvmChainById(row.token.chainId).key}/token/${row.token.address}`
        }
        rowRenderer={rowRenderer}
        columns={COLUMNS}
        data={data}
      />
    </Card>
  )
}
