'use client'

import { PlusIcon } from '@heroicons/react/20/solid'
import { Slot } from '@radix-ui/react-slot'
import { ChainId } from '@sushiswap/chain'
import { Button, Card, CardHeader, CardTitle, DataTable, LinkInternal } from '@sushiswap/ui'
import { SUSHISWAP_V3_SUPPORTED_CHAIN_IDS } from '@sushiswap/v3-sdk'
import { useAccount } from '@sushiswap/wagmi'
import { ConcentratedLiquidityPositionWithV3Pool } from '@sushiswap/wagmi/future'
import { useConcentratedLiquidityPositions } from '@sushiswap/wagmi/future/hooks'
import { ColumnDef, PaginationState, Row } from '@tanstack/react-table'
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { Writeable } from 'zod'

import { NAME_COLUMN_V3, POSITION_SIZE_CELL, POSITION_UNCLAIMED_CELL, PRICE_RANGE_COLUMN } from './columns'
import { usePoolFilters } from './PoolsFiltersProvider'

const COLUMNS = [NAME_COLUMN_V3, PRICE_RANGE_COLUMN, POSITION_SIZE_CELL, POSITION_UNCLAIMED_CELL] satisfies ColumnDef<
  ConcentratedLiquidityPositionWithV3Pool,
  unknown
>[]

const tableState = { sorting: [{ id: 'positionSize', desc: true }] }

interface ConcentratedPositionsTableProps {
  chainId?: ChainId
  poolId?: string
  hideClosed?: boolean
  onRowClick?(row: ConcentratedLiquidityPositionWithV3Pool): void
  hideNewPositionButton?: boolean
}

export const ConcentratedPositionsTable: FC<ConcentratedPositionsTableProps> = ({
  chainId,
  onRowClick,
  poolId,
  hideClosed,
  hideNewPositionButton = false,
}) => {
  const { address } = useAccount()
  const { chainIds, tokenSymbols } = usePoolFilters()

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

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
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <span>
              My Positions <span className="text-gray-400 dark:text-slate-500">({_positions.length})</span>
            </span>
            {!hideNewPositionButton ? (
              <LinkInternal shallow={true} href={`/pool/${chainId}:${poolId}/positions/create`}>
                <Button icon={PlusIcon} asChild size="sm">
                  Create position
                </Button>
              </LinkInternal>
            ) : null}
          </div>
        </CardTitle>
      </CardHeader>
      <DataTable
        testId="concentrated-positions"
        loading={isInitialLoading}
        linkFormatter={(row) => `/pool/${row.chainId}:${row.address}/positions/${row.tokenId.toString()}`}
        rowRenderer={rowRenderer}
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
