import { useBreakpoint } from '@sushiswap/hooks'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import { SortingState, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount } from '@sushiswap/wagmi'

import { NAME_COLUMN_V3, POSITION_SIZE_CELL, POSITION_UNCLAIMED_CELL, PRICE_RANGE_COLUMN } from './Cells/columns'
import { ConcentratedLiquidityPosition, useConcentratedLiquidityPositions } from '@sushiswap/wagmi/future/hooks'
import { SUSHISWAP_V3_SUPPORTED_CHAIN_IDS } from '@sushiswap/v3-sdk'
import { Writeable } from 'zod'
import { usePoolFilters } from '../../../PoolsFiltersProvider'

// rome-ignore lint: reasons
const COLUMNS = [NAME_COLUMN_V3, PRICE_RANGE_COLUMN, POSITION_SIZE_CELL, POSITION_UNCLAIMED_CELL] as any

export const ConcentratedPositionsTable: FC<{
  variant?: 'default' | 'minimal'
  poolId?: string
  hideClosed?: boolean
}> = ({ variant = 'default', poolId, hideClosed }) => {
  const { address } = useAccount()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')
  const { chainIds, tokenSymbols } = usePoolFilters()
  const [columnVisibility, setColumnVisibility] = useState({})
  const [sorting, setSorting] = useState<SortingState>([{ id: 'positionSize', desc: true }])

  const {
    data: positions,
    isLoading,
    isInitialLoading,
  } = useConcentratedLiquidityPositions({
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

  const table = useReactTable<ConcentratedLiquidityPosition>({
    data: _positions,
    state: {
      sorting,
      columnVisibility,
    },
    columns: COLUMNS,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  useEffect(() => {
    if (isSm && !isMd) {
      setColumnVisibility({})
    } else if (isSm) {
      setColumnVisibility({})
    } else {
      setColumnVisibility({
        positionSize: false,
        unclaimed: false,
      })
    }
  }, [isMd, isSm])

  const rowLink = useCallback((row: ConcentratedLiquidityPosition) => {
    return `/position/${row.chainId}:${row.tokenId}`
  }, [])

  if (variant === 'minimal') {
    return (
      <GenericTable<ConcentratedLiquidityPosition>
        table={table}
        loading={isInitialLoading}
        placeholder="No positions found"
        pageSize={!_positions ? 5 : _positions?.length}
        linkFormatter={rowLink}
        loadingOverlay={false}
      />
    )
  }

  return (
    <div className="mb-[120px]">
      <GenericTable<ConcentratedLiquidityPosition>
        table={table}
        loading={Boolean(isLoading && address)}
        placeholder="No positions found"
        pageSize={_positions?.length ? _positions.length : 1}
        linkFormatter={rowLink}
        loadingOverlay={false}
        testId={'concentrated-positions'}
      />
    </div>
  )
}
