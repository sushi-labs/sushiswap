import { Slot } from '@radix-ui/react-slot'
import { Protocol } from '@sushiswap/database'
import { DataTable } from '@sushiswap/ui'
import { useAccount } from '@sushiswap/wagmi'
import { ColumnDef, Row } from '@tanstack/react-table'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { useUserPositions } from 'lib/hooks'
import React, { FC, ReactNode, useCallback, useMemo } from 'react'
import { PositionWithPool } from 'types'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { APR_COLUMN, NAME_COLUMN, VALUE_COLUMN } from './Cells/columns'

const COLUMNS = [NAME_COLUMN, VALUE_COLUMN, APR_COLUMN] satisfies ColumnDef<PositionWithPool, unknown>[]

interface PositionsTableProps {
  protocol: Protocol
  onRowClick?(row: PositionWithPool): void
  rowLink?(row: PositionWithPool): string
}

const tableState = { sorting: [{ id: 'value', desc: true }] }

export const PositionsTable: FC<PositionsTableProps> = ({ protocol, onRowClick, rowLink }) => {
  const { address } = useAccount()
  const { chainIds, tokenSymbols } = usePoolFilters()

  const { data: positions, isValidating } = useUserPositions({ id: address, chainIds: SUPPORTED_CHAIN_IDS })

  const _positions = useMemo(() => {
    if (!positions) return []

    const _tokenSymbols = tokenSymbols?.filter((el) => el !== '') || []
    const searchFiltered = positions.filter((el) =>
      _tokenSymbols.length > 0
        ? _tokenSymbols.some((symbol) => {
            return [el.pool?.token0.symbol, el.pool?.token1.symbol].includes(symbol.toUpperCase())
          })
        : true
    )
    const chainFiltered = searchFiltered.filter((el) => chainIds.includes(el.chainId))
    return chainFiltered.filter((el) => el.pool?.protocol === protocol)
  }, [positions, tokenSymbols, chainIds, protocol])

  const rowRenderer = useCallback(
    (row: Row<PositionWithPool>, rowNode: ReactNode) => {
      if (onRowClick)
        return (
          <Slot className="cursor-pointer" onClick={() => onRowClick?.(row.original)}>
            {rowNode}
          </Slot>
        )
      return rowNode
    },
    [onRowClick]
  )

  return (
    <DataTable
      state={tableState}
      loading={isValidating}
      rowRenderer={rowRenderer}
      linkFormatter={rowLink}
      columns={COLUMNS}
      data={_positions}
    />
  )
}
