'use client'

import { PortfolioWalletToken } from '@sushiswap/graph-client/data-api'
import { DataTable, Slot } from '@sushiswap/ui'
import { ColumnDef, Row } from '@tanstack/react-table'
import { FC, ReactNode, useCallback } from 'react'
import {
  NAME_SYMBOL_AMOUNT_COLUMN,
  TOKEN_ICON_COLUMN,
  USD_COLUMN,
} from './columns'


const COLUMNS = [
  TOKEN_ICON_COLUMN,
  NAME_SYMBOL_AMOUNT_COLUMN,
  USD_COLUMN,
] satisfies ColumnDef<PortfolioWalletToken, unknown>[]

// const tableState = { sorting: [{ id: 'amountUSD', desc: true }] }

interface PortfolioWalletTableProps {
  isLoading: boolean
  data: PortfolioWalletToken[]
  onRowClick?(row: PortfolioWalletToken): void
}


export const PortfolioWalletTable: FC<PortfolioWalletTableProps> = ({
  isLoading,
  data,
  onRowClick,
}) => {
  // const [paginationState, setPaginationState] = useState<PaginationState>({
  //   pageIndex: 0,
  //   pageSize: 10,
  // })

  const rowRenderer = useCallback(
    (row: Row<PortfolioWalletToken>, rowNode: ReactNode) => {
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

  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>No data</div>

  return (
    <DataTable
      testId="portfolio-wallet-table"
      loading={isLoading}
      // linkFormatter={(row) =>
      //   `/pool/${row.chainId}:${
      //     row.address
      //   }/positions/${row.tokenId.toString()}`
      // }
      rowRenderer={rowRenderer}
      columns={COLUMNS}
      data={data.sort((a, b) => b.amountUSD - a.amountUSD)}
    />
  )
}
