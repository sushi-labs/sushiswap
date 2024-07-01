'use client'

import { PortfolioPosition } from '@sushiswap/graph-client/data-api'
import { DataTable, Slot } from '@sushiswap/ui'
import { ColumnDef, Row } from '@tanstack/react-table'
import { FC, ReactNode, useCallback } from 'react'
import { ICON_COLUMN, NAME_SYMBOL_AMOUNT_COLUMN, USD_COLUMN } from './columns'

const COLUMNS = [
  ICON_COLUMN,
  NAME_SYMBOL_AMOUNT_COLUMN,
  USD_COLUMN,
] satisfies ColumnDef<PortfolioPosition, unknown>[]

interface PortfolioV2PositionTableProps {
  isLoading: boolean
  data: PortfolioPosition[]
  onRowClick?(row: PortfolioPosition): void
}

export const PortfolioV2PositionTable: FC<PortfolioV2PositionTableProps> = ({
  isLoading,
  data,
  onRowClick,
}) => {
  const rowRenderer = useCallback(
    (row: Row<PortfolioPosition>, rowNode: ReactNode) => {
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

  if (isLoading) return <></>
  if (!data) return <></>

  return (
    <DataTable
      testId="portfolio-v2-position-table"
      loading={isLoading}
      // linkFormatter={(row) =>
      //   `/pool/${row.chainId}:${
      //     row.address
      //   }/positions/${row.tokenId.toString()}`
      // }
      rowRenderer={rowRenderer}
      columns={COLUMNS}
      data={data.sort((a, b) => b.amountUSD - a.amountUSD)}
      showColumnHeaders={false}
    />
  )
}
