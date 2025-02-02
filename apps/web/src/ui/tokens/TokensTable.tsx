'use client'

import { Slot } from '@radix-ui/react-slot'
import {
  ExploreTokens,
  GetExploreTokens,
  TokenListChainId,
} from '@sushiswap/graph-client/data-api'
import {
  Card,
  CardHeader,
  CardTitle,
  DataTable,
  SkeletonText,
} from '@sushiswap/ui'
import { ColumnDef, Row, SortingState, TableState } from '@tanstack/react-table'
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { useExploreTokens } from 'src/lib/hooks/api/useExploreTokens'
import { ChainKey } from 'sushi/chain'
import {
  FDV_COLUMN,
  PRICE_CHANGE_1D_COLUMN,
  PRICE_COLUMN,
  SPARKLINE_COLUMN,
  TOKENS_NAME_COLUMN,
} from './TokensTable.columns'

const COLUMNS = [
  TOKENS_NAME_COLUMN,
  PRICE_COLUMN,
  PRICE_CHANGE_1D_COLUMN,
  FDV_COLUMN,
  SPARKLINE_COLUMN,
] as ColumnDef<ExploreTokens[number], unknown>[]

interface TokensTableProps {
  chainId: TokenListChainId
  onRowClick?(row: ExploreTokens[number]): void
}

export const TokensTable: FC<TokensTableProps> = ({ chainId, onRowClick }) => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'liquidityUSD', desc: true },
  ])

  const { data: tokens, isLoading } = useExploreTokens({
    chainId: chainId as GetExploreTokens['chainId'],
  })

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: tokens?.length ?? 50,
      },
    }
  }, [tokens?.length, sorting])

  const rowRenderer = useCallback(
    (row: Row<ExploreTokens[number]>, rowNode: ReactNode) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isLoading ? (
            <div className="!w-28 !h-[18px]">
              <SkeletonText />
            </div>
          ) : (
            <span>Tokens</span>
          )}
        </CardTitle>
      </CardHeader>
      <DataTable
        state={state}
        onSortingChange={setSorting}
        loading={isLoading}
        linkFormatter={(row) =>
          `/${ChainKey[row.chainId]}/explore/tokens/${row.address}`
        }
        rowRenderer={rowRenderer}
        columns={COLUMNS}
        data={tokens || []}
      />
    </Card>
  )
}
