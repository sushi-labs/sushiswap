import { Slot } from '@radix-ui/react-slot'
import { DataTable } from '@sushiswap/ui'
import { SUSHISWAP_V3_SUPPORTED_CHAIN_IDS } from '@sushiswap/v3-sdk'
import { useAccount } from '@sushiswap/wagmi'
import { ConcentratedLiquidityPositionWithV3Pool } from '@sushiswap/wagmi/future'
import { useConcentratedLiquidityPositions } from '@sushiswap/wagmi/future/hooks'
import { ColumnDef, Row } from '@tanstack/react-table'
import React, { FC, ReactNode, useCallback, useMemo } from 'react'
import { Writeable } from 'zod'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { NAME_COLUMN_V3, POSITION_SIZE_CELL, POSITION_UNCLAIMED_CELL, PRICE_RANGE_COLUMN } from './Cells/columns'

const COLUMNS = [NAME_COLUMN_V3, PRICE_RANGE_COLUMN, POSITION_SIZE_CELL, POSITION_UNCLAIMED_CELL] satisfies ColumnDef<
  ConcentratedLiquidityPositionWithV3Pool,
  unknown
>[]

const tableState = { sorting: [{ id: 'positionSize', desc: true }] }

interface ConcentratedPositionsTableProps {
  poolId?: string
  hideClosed?: boolean
  onRowClick?(row: ConcentratedLiquidityPositionWithV3Pool): void
  rowLink?(row: ConcentratedLiquidityPositionWithV3Pool): string
}

export const ConcentratedPositionsTable: FC<ConcentratedPositionsTableProps> = ({
  rowLink,
  onRowClick,
  poolId,
  hideClosed,
}) => {
  const { address } = useAccount()
  const { chainIds, tokenSymbols } = usePoolFilters()

  const { data: positions, isInitialLoading } = useConcentratedLiquidityPositions({
    account: address,
    chainIds: SUSHISWAP_V3_SUPPORTED_CHAIN_IDS as Writeable<typeof SUSHISWAP_V3_SUPPORTED_CHAIN_IDS>,
  })

  const _positions = useMemo(() => {
    const _tokenSymbols = tokenSymbols?.filter((el) => el !== '') || []
    return (positions || [])
      ?.filter((el) => chainIds.includes(el.chainId))
      .filter((el) =>
        _tokenSymbols.length > 0
          ? _tokenSymbols.some((symbol) => {
              return [el.pool?.token0.symbol, el.pool?.token1.symbol].includes(symbol.toUpperCase())
            })
          : true
      )
      .filter((el) => {
        return (
          (hideClosed ? !el.liquidity?.eq('0') : true) &&
          (poolId ? el.address.toLowerCase() === poolId.toLowerCase() : true)
        )
      })
  }, [hideClosed, poolId, positions, chainIds, tokenSymbols])

  const rowRenderer = useCallback(
    (row: Row<ConcentratedLiquidityPositionWithV3Pool>, rowNode: ReactNode) => {
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
      testId="concentrated-positions"
      state={tableState}
      loading={isInitialLoading}
      linkFormatter={rowLink}
      rowRenderer={rowRenderer}
      columns={COLUMNS}
      data={_positions}
    />
  )
}
