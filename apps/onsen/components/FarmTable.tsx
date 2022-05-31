import { Table, Typography } from '@sushiswap/ui'
import { createTable, getCoreRowModel, useTableInstance } from '@tanstack/react-table'
import { TokenRepresentation } from 'features'
import { Farm } from 'features/onsen/context/Farm'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { useNetwork } from 'wagmi'

import { StakeAndSubscribeModal } from './StakeAndSubscribeModal'

interface FarmTableProps {
  chainId: number | undefined
  stakeTokens: TokenRepresentation[] | undefined
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
            {props.row.original?.incentives[0].liquidityStaked.currency.symbol}
          </Typography>
          <Typography variant="xxs" weight={500} className=" text-slate-200">
            {props.row.original?.tokenType}
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
  table.createDisplayColumn({
    id: 'rewards_24h',
    header: () => <div className="w-full text-right"> Rewards per 24h </div>,
    cell: (props) => {
      return (
        <div className="flex flex-col w-full">
          {props.row.original?.rewardsPerDay ? (
            Object.values(props.row.original?.rewardsPerDay).map((reward) => (
              <>
                <Typography variant="sm" weight={700} className="text-right text-slate-200">
                  {reward?.greaterThan('100000') ? reward?.toSignificant(6) : '< 0.01'}
                </Typography>
                <Typography variant="xs" weight={500} className="text-right text-slate-500">
                  {reward?.currency.symbol}
                </Typography>
              </>
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
    id: 'Subscribe',
    header: () => <div className="w-full text-left"> Subscribe </div>,
    cell: (props) => props.row.original ? <StakeAndSubscribeModal farm={props.row.original}/> : <></>,
  }),

]

export const FarmTable: FC<FarmTableProps> = (props) => {
  const { stakeTokens, placeholder, loading } = props
  const [initialized, setInitialized] = useState(!loading)

  useEffect(() => {
    if (!loading) setInitialized(true)
  }, [loading])

  const router = useRouter()
  const { activeChain } = useNetwork()
  const data = useMemo(() => {
    if (!stakeTokens) return []
    return stakeTokens.map((stakeToken) => new Farm({ stakeToken }))
  }, [stakeTokens])

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

export default FarmTable
