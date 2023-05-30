import { useAccount } from '@sushiswap/wagmi'
import { useUserPositions } from '../../lib/hooks'
import { SUPPORTED_CHAIN_IDS } from '../../config'
import React, { useEffect, useMemo, useState } from 'react'
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { PositionWithPool } from '../../types'
import { useBreakpoint } from '@sushiswap/hooks'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import { APR_COLUMN, NAME_COLUMN, VALUE_COLUMN } from '../PoolsSection/Tables/PositionsTable/Cells/columns'
import { Protocol } from '@sushiswap/client'

const COLUMNS = [NAME_COLUMN, VALUE_COLUMN, APR_COLUMN] as any

export const PositionTable = () => {
  const { address } = useAccount()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')
  const { data: userPositions, isValidating } = useUserPositions({ id: address, chainIds: SUPPORTED_CHAIN_IDS })
  const [columnVisibility, setColumnVisibility] = useState({})

  const _positions = useMemo(
    () => userPositions?.filter((el) => el.pool.protocol === Protocol.SUSHISWAP_V2) || [],
    [userPositions]
  )

  useEffect(() => {
    if (isSm && !isMd) {
      setColumnVisibility({ volume: false })
    } else if (isSm) {
      setColumnVisibility({})
    } else {
      setColumnVisibility({
        volume: false,
        apr: false,
        liquidityUSD: false,
      })
    }
  }, [isMd, isSm])

  const table = useReactTable<PositionWithPool>({
    data: _positions,
    state: {
      columnVisibility,
    },
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <GenericTable<PositionWithPool>
      table={table}
      loading={isValidating}
      placeholder="No positions found"
      pageSize={Math.max(userPositions?.length || 0, 5)}
      linkFormatter={(row) => `/pools/migrate/${row.pool.id}`}
    />
  )
}
