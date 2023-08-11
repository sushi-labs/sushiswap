import { useWallet } from '@aptos-labs/wallet-adapter-react'
import React, { useCallback, useMemo, useState } from 'react'
import { Pool, usePools } from 'utils/usePools'
import { PaginationState, SortingState, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import { NAME_COLUMN } from './Cells/columns'
import { isFarm, useFarms } from 'utils/useFarms'

const columns = [NAME_COLUMN] as any
const MAINNET_CONTRACT = process.env['MAINNET_CONTRACT'] || process.env['NEXT_PUBLIC_MAINNET_CONTRACT']
interface Props {
  farmsOnly: boolean
}
export const PoolsTable = ({ farmsOnly }: Props) => {
  const { network } = useWallet()
  const { data: pools, isLoading } = usePools(Number(network?.chainId) || 1)
  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])
  const [, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const { data: farms } = useFarms()
  const farmFilter = useMemo(() => {
    return pools?.filter((pool) => {
      const [chainId, ...address] = pool.id.split(':')
      const lpAddress = address.join(':')
      const _isFarm = farms?.data?.lps.indexOf(`${MAINNET_CONTRACT}::swap::LPToken<${lpAddress}>`)
      return _isFarm !== -1
    })
  }, [pools, farms])
  const rowLink = useCallback((row: Pool) => {
    return `/pool/${row.id}`
  }, [])
  const data = useMemo(
    () => (!farmsOnly ? pools?.flat() || [] : farmFilter?.flat() || []),
    [pools, farmsOnly, farmFilter]
  )
  const table = useReactTable<Pool>({
    data,
    state: {
      sorting,
    },
    columns: columns,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
    sortDescFirst: true,
  })
  return (
    <GenericTable<Pool>
      table={table}
      placeholder="No Pools Found"
      pageSize={data?.length ? data?.length : 5}
      loading={!pools || isLoading}
      testId="pools"
      linkFormatter={rowLink}
    />
  )
}
