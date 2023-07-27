import { useWallet } from '@aptos-labs/wallet-adapter-react'
import Container from '@sushiswap/ui/future/components/Container'
import React, { useCallback, useMemo } from 'react'
import { useUserPositions } from 'utils/useUserPositions'
import { NAME_COLUMN } from './Cells/columns'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Pool } from 'utils/usePools'

const columns = [NAME_COLUMN] as any

export const PositionsTable = () => {
  const { network, account } = useWallet()
  const { data: userPositions, isLoading } = useUserPositions(
    network?.name.toLowerCase() as string,
    account?.address as string,
    true
  )
  const data = useMemo(() => userPositions?.flat() || [], [userPositions])
  const table = useReactTable<Pool>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  const rowLink = useCallback((row: Pool) => {
    return `/pool/${row.id}`
  }, [])
  return (
    <Container maxWidth="7xl" className="px-4 mx-auto">
      <GenericTable<Pool>
        table={table}
        pageSize={data?.length ? data?.length : 5}
        loading={!userPositions || isLoading}
        testId="positions"
        placeholder="No positions found"
        linkFormatter={rowLink}
      />
    </Container>
  )
}
