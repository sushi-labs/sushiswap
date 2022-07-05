import { Table, Typography } from '@sushiswap/ui'
import { createTable, getCoreRowModel, useTableInstance } from '@tanstack/react-table'
import { Placeholder } from 'components/Placeholder'
import { IncentiveStatus } from 'lib'
import { Farm } from 'lib/Farm'
import React, { FC, useEffect, useState } from 'react'

import { ManageFarmModal } from './ManageFarmModal'

interface FarmTableProps {
  chainId: number | undefined
  farms: Farm[]
  showManageFarmAction?: boolean
  showIsSubscribed?: boolean
  placeholder: string
  loading: boolean
}

const table = createTable().setRowType<Farm>()

const defaultColumns = (tableProps: FarmTableProps) => [
  table.createDisplayColumn({
    id: 'Farm',
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
  table.createDataColumn('tvl', {
    header: () => <div className="w-full text-left"> TVL </div>,
    cell: (props) => {
      return (
        <>
          {props.getValue() && props.getValue() > 0 ? (
            <Typography variant="sm" weight={700} className=" text-slate-200">
              ${props.getValue().toPrecision(2)}
            </Typography>
          ) : (
            <Typography variant="xxs" weight={500} className=" text-slate-500">
              --
            </Typography>
          )}
        </>
      )
    },
  }),

  table.createDataColumn('incentives', {
    header: () => <div className="w-full text-left"> Rewards per day</div>,
    cell: (props) => {
      return (
        <div className="flex flex-col w-full">
          {props.getValue() ? (
            Object.values(props.getValue()).map((incentive) => {
              const textStyle = incentive.status === IncentiveStatus.ACTIVE ? 'text-slate-200' : 'text-slate-500'
              return (
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
                  <Typography variant="sm" weight={700} className={`text-right ${textStyle}`}>
                    {incentive.rewardsPerDay?.greaterThan('100000')
                      ? incentive?.rewardsPerDay.toSignificant(3)
                      : '< 0.01'}
                  </Typography>
                  <Typography variant="xs" weight={500} className={`text-right ${textStyle}`}>
                    {incentive?.rewardsPerDay.currency.symbol}
                  </Typography>
                </div>
              )
            })
          ) : (
            <></>
          )}
        </div>
      )
    },
  }),

  table.createDataColumn('apr', {
    header: () => <div className="w-full text-right"> APR </div>,
    cell: (props) => {
      return props.getValue() ? (
        <Typography variant="sm" weight={700} className="text-right text-slate-200">
          {Number(props.getValue()).toFixed(2)}%
        </Typography>
      ) : (
        <Typography variant="xxs" weight={500} className="text-right text-slate-500">
          --
        </Typography>
      )
    },
  }),
  table.createDisplayColumn({
    id: 'Action',
    header: () => (tableProps.showManageFarmAction ? <div className="w-full text-left"> Subscribe </div> : <></>),
    cell: (props) => {
      return tableProps.showManageFarmAction ? (
        props.row.original ? (
          <ManageFarmModal farm={props.row.original} chainId={tableProps.chainId} />
        ) : (
          <></>
        )
      ) : (
        <></>
      )
    },
  }),

  // table.createDisplayColumn({
  //   id: 'Manage',
  //   header: () => (tableProps.showSubscribeAction ? <div className="w-full text-left"> Subscribe </div> : <></>),
  //   cell: (props) => (
  //         <ManageFarmModal farm={props.row.original} chainId={tableProps.chainId}/>
  //       )
  // }),
]

export const FarmTable: FC<FarmTableProps> = (props) => {
  const { farms, placeholder, loading } = props
  const [initialized, setInitialized] = useState(!loading)

  useEffect(() => {
    if (!loading) setInitialized(true)
  }, [loading])

  const [columns] = useState<typeof defaultColumns>(() => [...defaultColumns({ ...props })])

  const instance = useTableInstance(table, {
    data: farms,
    // @ts-ignore
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  console.log('rerender farmTable')

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
          {instance.getRowModel().rows.length === 0 &&
            !initialized &&
            Array.from(Array(4)).map((_, i) => (
              <Table.tr key={i} className="flex">
                <Table.td className="h-12">
                  <div className="h-4 rounded-full animate-pulse bg-slate-700" />
                </Table.td>
                <Table.td className="h-12">
                  <div className="h-4 rounded-full animate-pulse bg-slate-800" />
                </Table.td>
                <Table.td className="h-12">
                  <div className="h-4 rounded-full animate-pulse bg-slate-700" />
                </Table.td>
                <Table.td className="h-12">
                  <div className="h-4 rounded-full animate-pulse bg-slate-800" />
                </Table.td>
                <Table.td className="h-12">
                  <div className="h-4 rounded-full animate-pulse bg-slate-700" />
                </Table.td>
              </Table.tr>
            ))}
          {instance.getRowModel().rows.length === 0 && initialized && (
            <Table.tr>
              <Table.td colSpan={columns.length} className="h-[192px] py-4 !text-xs italic text-center text-slate-500">
                <div className="flex justify-center">
                  <div>
                    <Placeholder height={140} />
                  </div>
                </div>
                {placeholder}
              </Table.td>
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
