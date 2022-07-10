import { ChainId } from '@sushiswap/chain'
import { formatPercent } from '@sushiswap/format'
import { Link } from '@sushiswap/ui'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import { getBuiltGraphSDK, KashiPair as KashiPairDTO } from '.graphclient'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const sdk = await getBuiltGraphSDK()
  const { crossChainKashiPairs: data } = await sdk.CrossChainKashiPairs({
    chainIds: [ChainId.ARBITRUM, ChainId.POLYGON],
  })

  console.log({ data })

  // data.sort((a, b) => {
  //   if (Number(a.totalAsset.base) > Number(b.totalAsset.base)) {
  //     return -1
  //   }
  //   if (Number(a.totalAsset.base) < Number(b.totalAsset.base)) {
  //     return 1
  //   }
  //   return 0
  // })

  return {
    props: {
      data,
    },
  }
}

const columns: ColumnDef<KashiPairDTO>[] = [
  // Data Column
  {
    accessorKey: 'chainId',
    header: () => 'Chain',
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'name',
    header: () => 'Name',
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'asset',
    header: () => 'Asset',
    cell: (cell) => cell.getValue().symbol,
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'collateral',
    header: () => 'Collateral',
    cell: (cell) => cell.getValue().symbol,
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'totalAsset',
    header: () => 'Supplied',
    cell: (cell) => cell.getValue().base,
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'kpi',
    header: () => 'Supply APR',
    cell: (cell) => formatPercent(cell.getValue().supplyAPR / 1e18),
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'totalBorrow',
    header: () => 'Borrowed',
    cell: (cell) => cell.getValue().base,
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'kpi',
    header: () => 'Borrow APR',
    cell: (cell) => formatPercent(cell.getValue().borrowAPR / 1e18),
    footer: (props) => props.column.id,
  },
  // Display Column
  {
    id: 'supply',
    header: () => 'Supply',
    cell: (props) => (
      <Link.Internal href={`/${props.row.original.chainId}/${props.row.original.id}/supply`}>Supply</Link.Internal>
    ),
  },
  // Display Column
  {
    id: 'borrow',
    header: () => 'Borrow',
    cell: (props) => (
      <Link.Internal href={`/${props.row.original.chainId}/${props.row.original.id}/borrow`}>Borrow</Link.Internal>
    ),
  },
]

export default function Index({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-8">
      <table className="w-full max-w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
