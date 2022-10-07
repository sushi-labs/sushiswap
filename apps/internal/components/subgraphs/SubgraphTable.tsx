import { ChainId } from '@sushiswap/chain'
import { formatPercent } from '@sushiswap/format'
import { CHAIN_NAME } from '@sushiswap/graph-config'
import { NetworkIcon } from '@sushiswap/ui'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { GenericTable } from 'components/Table'
import { Subgraph } from 'lib'

interface SubgraphTable {
  subgraphs: Subgraph[]
  groupBy: keyof Subgraph
}

const columnHelper = createColumnHelper<Subgraph>()
const columns = [
  columnHelper.accessor('category', {
    header: 'Category',
    cell: (info) => info.getValue(),
    enableHiding: true,
  }),
  columnHelper.accessor('chainId', {
    header: 'Chain',
    cell: (info) => {
      const chainId = info.getValue()

      return (
        <div className="flex space-x-2">
          <NetworkIcon type="circle" chainId={chainId} width={20} height={20} />
          <div>{CHAIN_NAME[chainId] ?? ChainId[chainId]}</div>
        </div>
      )
    },
    enableHiding: true,
  }),
  columnHelper.accessor('subgraphName', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('data.startBlock', {
    header: 'Start Block',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'Synced %',
    header: 'Synced %',
    cell: ({ row }) => formatPercent(row.original.data.lastSyncedBlock / row.original.data.chainHeadBlock),
  }),
  columnHelper.accessor('data.lastSyncedBlock', {
    header: 'Synced Block',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('data.chainHeadBlock', {
    header: 'Last Block',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('data.nonFatalErrorCount', {
    header: 'NFError Count',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'Status',
    header: 'Status',
    cell: ({ row }) => {
      const unsyncedBlockCount = row.original.data.chainHeadBlock - row.original.data.lastSyncedBlock
      const status = row.original.data.hasFailed ? 'Failed' : unsyncedBlockCount <= 10 ? 'Synced' : 'Syncing'

      switch (status) {
        case 'Synced':
          return <div className="text-green">{status}</div>
        case 'Syncing':
          return (
            <div className="text-yellow">
              {status} ({unsyncedBlockCount})
            </div>
          )
        case 'Failed':
          return <div className="text-red">{status}</div>
      }
    },
  }),
]

export function SubgraphTable({ subgraphs, groupBy }: SubgraphTable) {
  const table = useReactTable<Subgraph>({
    data: subgraphs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnVisibility: { [groupBy]: false },
    },
  })

  return <GenericTable table={table} columns={columns} />
}
