import { Slot } from '@radix-ui/react-slot'
import { DataTable } from '@sushiswap/ui'
import { Sheet, SheetContent, SheetTrigger } from '@sushiswap/ui/components/sheet'
import { SUSHISWAP_V3_SUPPORTED_CHAIN_IDS } from '@sushiswap/v3-sdk'
import { useAccount } from '@sushiswap/wagmi'
import { ConcentratedLiquidityPositionWithV3Pool } from '@sushiswap/wagmi/future'
import { useConcentratedLiquidityPositions } from '@sushiswap/wagmi/future/hooks'
import { ColumnDef, Row } from '@tanstack/react-table'
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { Writeable } from 'zod'

import Page from '../../../../../app/pool/[id]/page'
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
  variant?: 'sheet' | 'default'
  onRowClick?(row: Row<ConcentratedLiquidityPositionWithV3Pool>): void
}

export const ConcentratedPositionsTable: FC<ConcentratedPositionsTableProps> = ({
  variant = 'default',
  poolId,
  hideClosed,
  onRowClick,
}) => {
  const { address } = useAccount()
  const { chainIds, tokenSymbols } = usePoolFilters()
  const [peekedId, setPeekedId] = useState<{ id: string; positionId: string }>({ id: '', positionId: '' })

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

  const rowRenderer = useCallback((row: Row<ConcentratedLiquidityPositionWithV3Pool>, rowNode: ReactNode) => {
    return (
      <_SheetTrigger row={row} onPeek={setPeekedId}>
        {rowNode}
      </_SheetTrigger>
    )
  }, [])

  const rowRendererDefault = useCallback(
    (row: Row<ConcentratedLiquidityPositionWithV3Pool>, rowNode: ReactNode) => {
      if (onRowClick) return <Slot onClick={() => onRowClick?.(row)}>{rowNode}</Slot>
      return rowNode
    },
    [onRowClick]
  )

  if (variant === 'default') {
    return (
      <DataTable
        testId="concentrated-positions"
        state={tableState}
        loading={isInitialLoading}
        rowRenderer={rowRendererDefault}
        columns={COLUMNS}
        data={_positions}
      />
    )
  }

  return (
    <Sheet modal>
      <DataTable
        testId="concentrated-positions"
        state={tableState}
        loading={isInitialLoading}
        rowRenderer={rowRenderer}
        columns={COLUMNS}
        data={_positions}
      />
      <SheetContent side="right" className="overflow-auto min-w-[calc(100vw-16px)] md:min-w-[unset] !max-w-7xl">
        <Page params={peekedId} />
      </SheetContent>
    </Sheet>
  )
}

const _SheetTrigger: FC<{
  row: Row<ConcentratedLiquidityPositionWithV3Pool>
  children: ReactNode
  onPeek({ id, positionId }: { id: string; positionId: string }): void
}> = ({ row, children, onPeek }) => {
  const onMouseEnter = useCallback(() => {
    onPeek({ id: `${row.original.chainId}%3A${row.original.address}`, positionId: row.original.tokenId.toString() })
  }, [onPeek, row.original.address, row.original.chainId, row.original.tokenId])

  return (
    <SheetTrigger asChild onMouseEnter={onMouseEnter} type={undefined}>
      {children}
    </SheetTrigger>
  )
}
