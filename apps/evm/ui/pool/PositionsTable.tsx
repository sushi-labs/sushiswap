import { Slot } from '@radix-ui/react-slot'
import { Protocol } from '@sushiswap/database'
import { Card, CardHeader, CardTitle, DataTable } from '@sushiswap/ui'
import { useAccount } from '@sushiswap/wagmi'
import { ColumnDef, PaginationState, Row } from '@tanstack/react-table'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { useUserPositions } from 'lib/hooks'
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { PositionWithPool } from 'types'

import {
  APR_COLUMN,
  NAME_COLUMN_POSITION_WITH_POOL,
  VALUE_COLUMN,
} from './columns'
import { usePoolFilters } from './PoolsFiltersProvider'

const COLUMNS = [
  NAME_COLUMN_POSITION_WITH_POOL,
  VALUE_COLUMN,
  APR_COLUMN,
] satisfies ColumnDef<PositionWithPool, unknown>[]

interface PositionsTableProps {
  protocol: Protocol
  onRowClick?(row: PositionWithPool): void
  rowLink?(row: PositionWithPool): string
}

const tableState = { sorting: [{ id: 'value', desc: true }] }

export const PositionsTable: FC<PositionsTableProps> = ({
  protocol,
  onRowClick,
  rowLink,
}) => {
  const { address } = useAccount()
  const { chainIds, tokenSymbols } = usePoolFilters()
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: positions, isValidating } = useUserPositions({
    id: address,
    chainIds: SUPPORTED_CHAIN_IDS,
  })

  const _positions = useMemo(() => {
    if (!positions) return []

    const _tokenSymbols = tokenSymbols?.filter((el) => el !== '') || []
    const searchFiltered = positions.filter((el) =>
      _tokenSymbols.length > 0
        ? _tokenSymbols.some((symbol) => {
            return [el.pool?.token0.symbol, el.pool?.token1.symbol].includes(
              symbol.toUpperCase(),
            )
          })
        : true,
    )
    const chainFiltered = searchFiltered.filter((el) =>
      chainIds.includes(el.chainId),
    )
    return chainFiltered.filter((el) => el.pool?.protocol === protocol)
  }, [positions, tokenSymbols, chainIds, protocol])

  const rowRenderer = useCallback(
    (row: Row<PositionWithPool>, rowNode: ReactNode) => {
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
          My Positions{' '}
          <span className="text-gray-400 dark:text-slate-500">
            ({_positions.length})
          </span>
        </CardTitle>
      </CardHeader>
      <DataTable
        loading={isValidating}
        rowRenderer={rowRenderer}
        linkFormatter={rowLink}
        columns={COLUMNS}
        data={_positions}
        pagination={true}
        onPaginationChange={setPaginationState}
        state={{
          ...tableState,
          pagination: paginationState,
        }}
      />
    </Card>
  )
}
