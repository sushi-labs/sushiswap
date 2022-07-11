import { ChainId } from '@sushiswap/chain'
import { formatPercent } from '@sushiswap/format'
import { Table } from '@sushiswap/ui'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import get from 'lodash.get'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import { getBuiltGraphSDK, KashiPair as KashiPairDTO } from '.graphclient'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const orderBy = query.orderBy || 'kpi.supplyAPR'
  const sdk = await getBuiltGraphSDK()
  const { crossChainKashiPairs: data } = await sdk.CrossChainKashiPairs({
    chainIds: [ChainId.ARBITRUM, ChainId.POLYGON],
  })
  return {
    props: {
      data: data.sort((a, b) => {
        if (Number(get(a, orderBy)) > Number(get(b, orderBy))) {
          return -1
        }
        if (Number(get(a, orderBy)) < Number(get(b, orderBy))) {
          return 1
        }
        return 0
      }),
    },
  }
}

const columns: ColumnDef<KashiPairDTO>[] = [
  // Data Column
  {
    accessorKey: 'chainName',
    header: () => 'Chain',
    footer: (props) => props.column.id,
    meta: {
      align: 'left',
    },
  },
  // {
  //   accessorKey: 'name',
  //   header: () => 'Name',
  //   footer: (props) => props.column.id,
  // },
  {
    accessorKey: 'asset',
    header: () => 'Asset',
    cell: (cell) => (
      <>
        <div className="font-semibold">{cell.getValue().name}</div>
        <div className="text-sm font-light text-slate-400">{cell.getValue().symbol}</div>
      </>
    ),
    footer: (props) => props.column.id,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'collateral',
    header: () => 'Collateral',
    cell: (cell) => (
      <>
        <div className="font-semibold">{cell.getValue().name}</div>
        <div className="text-sm font-light text-slate-400">{cell.getValue().symbol}</div>
      </>
    ),
    footer: (props) => props.column.id,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'totalAsset',
    header: () => 'Supplied',
    cell: (cell) => <div className="font-semibold">{cell.getValue().base}</div>,
    footer: (props) => props.column.id,
    meta: {
      align: 'right',
    },
  },
  {
    accessorKey: 'kpi',
    header: () => 'Supply APR',
    cell: (cell) => <div className="font-semibold">{formatPercent(cell.getValue().supplyAPR / 1e18)}</div>,
    footer: (props) => props.column.id,
    meta: {
      align: 'right',
    },
  },
  {
    accessorKey: 'totalBorrow',
    header: () => 'Borrowed',
    cell: (cell) => <div className="font-semibold">{cell.getValue().base}</div>,
    footer: (props) => props.column.id,
    meta: {
      align: 'right',
    },
  },
  {
    accessorKey: 'kpi',
    header: () => 'Borrow APR',
    cell: (cell) => <div className="font-semibold">{formatPercent(cell.getValue().borrowAPR / 1e18)}</div>,
    footer: (props) => props.column.id,
    meta: {
      align: 'right',
    },
  },
  // Display Column
  // {
  //   id: 'supply',
  //   header: () => 'Supply',
  //   cell: (props) => (
  //     <Link.Internal href={`/${props.row.original.chainId}/${props.row.original.id}/supply`}>Supply</Link.Internal>
  //   ),
  //   meta: {
  //     align: 'center',
  //   },
  // },
  // Display Column
  // {
  //   id: 'borrow',
  //   header: () => 'Borrow',
  //   cell: (props) => (
  //     <Link.Internal href={`/${props.row.original.chainId}/${props.row.original.id}/borrow`}>Borrow</Link.Internal>
  //   ),
  //   meta: {
  //     align: 'center',
  //   },
  // },
]

export default function Index({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <div>
        <div className="container py-8 mx-auto">MARKETS</div>
      </div>
      <div>
        <Table.container className="container mx-auto">
          <Table.table className="w-full">
            <Table.thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.th
                      key={header.id}
                      colSpan={header.colSpan}
                      align={(header.column.columnDef.meta as any)?.align}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </Table.th>
                  ))}
                </Table.tr>
              ))}
            </Table.thead>
            <Table.tbody>
              {table.getRowModel().rows.map((row) => (
                <Table.tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.td key={cell.id} align={(cell.column.columnDef.meta as any)?.align} className="py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.td>
                  ))}
                </Table.tr>
              ))}
            </Table.tbody>
          </Table.table>
        </Table.container>
      </div>
    </>
  )
}
