import { Table, Typography } from '@sushiswap/ui'
import { createTable, getCoreRowModel, useTableInstance } from '@tanstack/react-table'
import { Incentive } from 'features'
import { useRouter } from 'next/router'
import React, { FC, HTMLAttributes, useEffect, useMemo, useState } from 'react'
import { useNetwork } from 'wagmi'


interface IncentiveTableProps {
  chainId: number | undefined
  incentives: Incentive[]
  placeholder: string
  setSelectedRows: any
  loading: boolean
}

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLAttributes<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!)

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = indeterminate
    }
  }, [ref, indeterminate])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  )
}

const table = createTable().setRowType<Incentive>()

const defaultColumns = (tableProps: IncentiveTableProps) => [

  table.createDisplayColumn({
    id: 'select',
    header: ({ instance }) => (
      <IndeterminateCheckbox
        {...{
          checked: instance.getIsAllRowsSelected(),
          indeterminate: instance.getIsSomeRowsSelected(),
          onChange: instance.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <div className="px-1">
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),
  }),
  table.createDisplayColumn({
    id: 'rewardToken',
    header: () => <div className="w-full text-left"> Reward Token </div>,
    cell: (props) => {
      return (
        <div className="flex flex-col w-full">
          <Typography variant="sm" weight={700} className=" text-slate-200">
            {props.row.original?.rewardRemaining.currency.name}
          </Typography>
        </div>
      )
    },
  }),

  table.createDataColumn('rewardRemaining', {
    header: () => <div className="w-full text-left">Rewards remaining</div>,
    cell: (props) => {
      return (
        <div className="flex flex-col w-full">
          <Typography variant="sm" weight={700} className=" text-slate-200">
            {props.getValue().toExact()}
          </Typography>
          <Typography variant="xxs" weight={500} className=" text-slate-200">
            {props.getValue().currency.symbol}
          </Typography>
        </div>
      )
    },
  }),
  // table.createDisplayColumn({
  //   id: 'TVL',
  //   header: () => <div className="w-full text-left"> TVL </div>,
  //   cell: () => 'TODO', // TODO: this needs pricing before we sum it up
  // }),
  // table.createDisplayColumn({
  //   id: 'rewards_24h',
  //   header: () => <div className="w-full text-right"> Rewards per 24h </div>,
  //   cell: (props) => {
  //     return (
  //       <div className="flex flex-col w-full">
  //         {props.row.original?.rewardsPerDay ? (
  //           Object.values(props.row.original?.rewardsPerDay).map((reward) => (
  //             <>
  //               <Typography variant="sm" weight={700} className="text-right text-slate-200">
  //                 {reward?.greaterThan('100000') ? reward?.toSignificant(6) : '< 0.01'}
  //               </Typography>
  //               <Typography variant="xs" weight={500} className="text-right text-slate-500">
  //                 {reward?.currency.symbol}
  //               </Typography>
  //             </>
  //           ))
  //         ) : (
  //           <></>
  //         )}
  //       </div>
  //     )
  //   },
  // }),
  // table.createDisplayColumn({
  //   id: 'APR',
  //   header: () => <div className="w-full text-left"> APR </div>,
  //   cell: () => 'TODO',
  // }),

]

export const IncentiveTable: FC<IncentiveTableProps> = (props) => {
  const { incentives, placeholder, loading, setSelectedRows } = props
  const [initialized, setInitialized] = useState(!loading)
  const [rowSelection, setRowSelection] = useState({})

  useEffect(() => {
    if (!loading) setInitialized(true)
  }, [loading])

  const router = useRouter()
  const { activeChain } = useNetwork()
  // const data = useMemo(() => {
  //   if (!incentives) return []
  //   return incentives.map((stakeToken) => new Farm({ stakeToken }))
  // }, [incentives])

  const [columns] = React.useState<typeof defaultColumns>(() => [
    ...defaultColumns({ ...props, chainId: activeChain?.id }),
  ])

  const instance = useTableInstance(table, {
    data: incentives,
    // @ts-ignore
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  })

  useMemo( () => {
    if (rowSelection) {
      setSelectedRows(instance.getSelectedRowModel().flatRows.map(row => row.original))
    }
  }, [rowSelection, setSelectedRows, instance])

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
