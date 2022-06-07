import { Table, Typography } from '@sushiswap/ui'
import { createTable, getCoreRowModel, useTableInstance } from '@tanstack/react-table'
import { Farm } from 'lib/Farm'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'

import { StakeAndSubscribeModal } from './StakeAndSubscribeModal'

interface FarmTableProps {
  chainId: number | undefined
  farms: Farm[] | undefined
  showSubscribeAction?: boolean
  showIsSubscribed?: boolean
  placeholder: string
  loading: boolean
}

const table = createTable().setRowType<Farm>()

const defaultColumns = (tableProps: FarmTableProps) => [
  table.createDisplayColumn({
    id: 'Token',
    header: () => <div className="w-full text-left"> Token </div>,
    cell: (props) => {
      return (
        <div className="flex flex-col w-full">
          <Typography variant="sm" weight={700} className=" text-slate-200">
            {props.row.original?.stakeToken.symbol}
          </Typography>
          <Typography variant="xxs" weight={500} className=" text-slate-200">
            {props.row.original?.farmType}
          </Typography>
        </div>
      )
    },
  }),
  table.createDisplayColumn({
    id: 'TVL',
    header: () => <div className="w-full text-left"> TVL </div>,
    cell: () => 'TODO', // TODO: this needs pricing before we sum it up
  }),

  table.createDataColumn('incentives', {
    header: () => <div className="w-full text-left"> Rewards per day</div>,
    cell: (props) => {
      return (
        <div className="flex flex-col w-full">
          {props.getValue() ? (
            Object.values(props.getValue()).map((incentive) => (
              <div className="flex space-x-2" key={incentive.id}>
                {tableProps.showIsSubscribed ? (
                  incentive.isSubscribed ? (
                    <Typography variant="sm" weight={700} className="text-right text-green-400">
                      ✓
                    </Typography>
                  ) : (
                    <Typography variant="sm" weight={700} className="text-right text-yellow-400">
                      ○
                    </Typography>
                  )
                ) : (
                  <></>
                )}
                <Typography variant="sm" weight={700} className="text-right text-slate-200">
                  {incentive.rewardsPerDay?.greaterThan('100000')
                    ? incentive?.rewardsPerDay.toSignificant(3)
                    : '< 0.01'}
                </Typography>
                <Typography variant="xs" weight={500} className="text-right text-slate-500">
                  {incentive?.rewardsPerDay.currency.symbol}
                </Typography>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      )
    },
  }),

  table.createDisplayColumn({
    id: 'APR',
    header: () => <div className="w-full text-left"> APR </div>,
    cell: () => 'TODO',
  }),
  table.createDisplayColumn({
    id: 'Action',
    header: () => (tableProps.showSubscribeAction ? <div className="w-full text-left"> Subscribe </div> : <></>),
    cell: (props) =>
      tableProps.showSubscribeAction ? (
        props.row.original ? (
          <StakeAndSubscribeModal farm={props.row.original} />
        ) : (
          <></>
        )
      ) : (
        <></>
      ),
  }),
]

export const FarmTable: FC<FarmTableProps> = (props) => {
  const { farms, placeholder, loading } = props
  const [initialized, setInitialized] = useState(!loading)

  useEffect(() => {
    if (!loading) setInitialized(true)
  }, [loading])

  const router = useRouter()
  const { activeChain } = useNetwork()

  const [columns] = React.useState<typeof defaultColumns>(() => [
    ...defaultColumns({ ...props, chainId: activeChain?.id }),
  ])

  const instance = useTableInstance(table, {
    data: farms ?? [],
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

export default FarmTable
