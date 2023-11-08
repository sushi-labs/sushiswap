import { useWallet } from '@aptos-labs/wallet-adapter-react'
import Container from '@sushiswap/ui/future/components/Container'
import React, { useCallback, useMemo } from 'react'
import { useUserPositions } from 'utils/useUserPositions'
import { NAME_COLUMN } from './Cells/columns'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Pool } from 'utils/usePools'
import { useDebounce } from '@sushiswap/hooks'

const columns = [NAME_COLUMN] as any
interface Props {
  query: string
}

export const PositionsTable = ({ query }: Props) => {
  const { account } = useWallet()
  const { data: userPositions, isLoading } = useUserPositions(
    account?.address as string,
    true,
  )
  const data = useMemo(() => userPositions?.flat() || [], [userPositions])

  const debouncedQuery = useDebounce(query.trimStart().toLowerCase(), 400)
  const tableData = useMemo(() => {
    if (debouncedQuery.split(' ')[0] == '') return data
    return data.filter(
      (pool) =>
        debouncedQuery
          ?.split(' ')
          .includes(pool.data.token_x_details.symbol.toLowerCase()) ||
        debouncedQuery
          ?.split(' ')
          .includes(pool.data.token_y_details.symbol.toLowerCase()),
    )
  }, [debouncedQuery, data])

  const table = useReactTable<Pool>({
    data: tableData?.length ? tableData : data,
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
        pageSize={
          tableData?.length
            ? tableData?.length
            : data?.length
            ? data?.length
            : 5
        }
        loading={!userPositions || isLoading}
        testId="positions"
        placeholder="No positions found"
        linkFormatter={rowLink}
      />
    </Container>
  )
}
