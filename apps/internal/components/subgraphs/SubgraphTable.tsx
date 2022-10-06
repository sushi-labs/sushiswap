import { formatPercent } from '@sushiswap/format'
import { CHAIN_NAME } from '@sushiswap/graph-config'
import { classNames, Table } from '@sushiswap/ui'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
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
    cell: (info) => CHAIN_NAME[info.getValue()],
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

  return (
    <Table.container>
      <Table.table>
        <Table.thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.thr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{ maxWidth: header.column.getSize(), width: header.column.getSize() }}
                >
                  <div
                    {...{
                      className: classNames(
                        header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                        'h-full flex items-center gap-2'
                      ),
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </div>
                </Table.th>
              ))}
            </Table.thr>
          ))}
        </Table.thead>
        <Table.tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <Table.tr key={row.id} className="cursor-pointer">
                {row.getVisibleCells().map((cell) => {
                  return (
                    <Table.td key={cell.id} style={{ maxWidth: columns[0].size, width: columns[0].size }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.td>
                  )
                })}
              </Table.tr>
            )
          })}
        </Table.tbody>
      </Table.table>
    </Table.container>
  )
}
