import { shortenAddress } from '@sushiswap/format'
import { Table, Typography } from '@sushiswap/ui'
import { createTable, getCoreRowModel, useTableInstance } from '@tanstack/react-table'
import { Incentive, IncentiveRepresentation } from 'features'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { useNetwork } from 'wagmi'

interface IncentiveTableProps {
  chainId: number | undefined
  incentives: IncentiveRepresentation[] | undefined
  placeholder: string
  loading: boolean
}

const table = createTable().setRowType<Incentive>()

const defaultColumns = (tableProps: IncentiveTableProps) => [
  table.createDisplayColumn({
    id: 'Token',
    header: () => <div className="w-full text-left"> Token </div>,
    cell: (props) => {
      return (
        <div className="flex flex-col w-full">
          <Typography variant="sm" weight={700} className=" text-slate-200">
            {props.row.original?.liquidityStaked.currency.symbol}
          </Typography>
          <Typography variant="xxs" weight={500} className=" text-slate-200">
            {props.row.original?.tokenType}
          </Typography>
        </div>
      )
    },
  }),
  table.createDataColumn('liquidityStaked', {
    header: () => <div className="w-full text-right">TVL</div>,
    cell: (props) => {
      return (
        <div className="flex flex-col w-full">
          <Typography variant="sm" weight={700} className="text-right text-slate-200">
            {props.getValue().greaterThan('0') ? props.getValue().toSignificant(6) : '< 0.01'}
          </Typography>
          <Typography variant="xs" weight={500} className="text-right text-slate-500">
            {props.getValue().currency.symbol}
          </Typography>
        </div>
      )
    },
  }),
  table.createDisplayColumn({
    id: 'rewards_24h',
    header: () => <div className="w-full text-left"> Rewards per 24h </div>,
    cell: () => '',
  }),
  table.createDisplayColumn({
    id: 'APR',
    header: () => <div className="w-full text-left"> APR </div>,
    cell: () => '',
  }),
]

export const IncentiveTable: FC<IncentiveTableProps> = (props) => {
  const { incentives, placeholder, loading } = props
  const [initialized, setInitialized] = useState(!loading)

  useEffect(() => {
    if (!loading) setInitialized(true)
  }, [loading])

  const router = useRouter()
  const { activeChain } = useNetwork()
  const data = useMemo(() => {
    if (!incentives) return []
    return incentives.map((incentive) => new Incentive({ incentive }))
  }, [incentives])

  const [columns] = React.useState<typeof defaultColumns>(() => [
    ...defaultColumns({ ...props, chainId: activeChain?.id }),
  ])

  const instance = useTableInstance(table, {
    data,
    // @ts-ignore
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table.container>
      <Table.table>
        <Table.thead>
          {instance.getHeaderGroups().map((headerGroup) => (
            <Table.thr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.th key={header.id} colSpan={header.colSpan}>
                  {header.renderHeader()}
                </Table.th>
              ))}
            </Table.thr>
          ))}
        </Table.thead>
        <Table.tbody>
          {instance.getRowModel().rows.length === 0 && (
            <Table.tr>
              {!initialized ? (
                <td colSpan={columns.length}>
                  <div className="w-full h-12 animate-pulse bg-slate-800/30" />
                </td>
              ) : (
                <Table.td colSpan={columns.length} className="!text-xs italic text-center text-slate-500">
                  {placeholder}
                </Table.td>
              )}
            </Table.tr>
          )}
          {instance.getRowModel().rows.map((row) => {
            return (
              <Table.tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return <Table.td key={cell.id}>{cell.renderCell()}</Table.td>
                })}
              </Table.tr>
            )
          })}
        </Table.tbody>
      </Table.table>
    </Table.container>
  )
}

export default IncentiveTable
