import { shortenAddress } from '@sushiswap/format'
import { Chip, ProgressBar, ProgressColor, Table, Typography } from '@sushiswap/ui'
import { createTable, getCoreRowModel, useTableInstance } from '@tanstack/react-table'
import { Vesting } from 'features/context'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { useNetwork } from 'wagmi'

import { FuroStatus } from './context/enums'
import { StreamRepresentation, VestingRepresentation } from './context/representations'
import { Stream } from './context/Stream'

export enum FuroTableType {
  INCOMING,
  OUTGOING,
}

interface FuroTableProps {
  streams: StreamRepresentation[]
  vestings: VestingRepresentation[]
  type: FuroTableType
  placeholder: string
  loading: boolean
}

const table = createTable().setRowType<Stream>()

const defaultColumns = (tableProps: FuroTableProps) => [
  table.createDataColumn('streamedPercentage', {
    header: () => <div className="w-full text-left">Streamed</div>,
    cell: (props) => (
      <div className="flex gap-3">
        <ProgressBar
          showLabel={false}
          className="min-w-[100px] max-w-[100px] h-3"
          progress={Math.min(Math.max(props.getValue(), 0), 1)}
          color={ProgressColor.GRADIENT}
        />
        <Typography variant="sm" weight={700} className="text-slate-200">
          {(Number(Math.min(Math.max(props.getValue(), 0), 1)) * 100).toFixed(1)}%
        </Typography>
      </div>
    ),
  }),
  table.createDataColumn('status', {
    header: () => <div className="w-full text-left">Status</div>,
    cell: (props) => (
      <Chip
        className="capitalize"
        label={props.getValue() === FuroStatus.EXTENDED ? 'Active' : props.getValue().toLowerCase()}
        color={
          props.getValue() === FuroStatus.CANCELLED
            ? 'red'
            : props.getValue() === FuroStatus.COMPLETED
            ? 'default'
            : props.getValue() === FuroStatus.ACTIVE
            ? 'green'
            : props.getValue() === FuroStatus.UPCOMING
            ? 'yellow'
            : props.getValue() === FuroStatus.EXTENDED
            ? 'green'
            : 'default'
        }
      />
    ),
  }),
  table.createDataColumn('amount', {
    header: () => <div className="w-full text-right">Amount</div>,
    cell: (props) => {
      if (props.row.original?.status === FuroStatus.CANCELLED) return `-`
      return (
        <div className="flex flex-col w-full">
          <Typography variant="sm" weight={700} className="text-right text-slate-200">
            {props.getValue().greaterThan('0') ? props.getValue().toSignificant(6) : '< 0.01'}
          </Typography>
          <Typography variant="xs" weight={500} className="text-right text-slate-500">
            {props.row.original?.token.symbol}
          </Typography>
        </div>
      )
    },
  }),
  table.createDataColumn('type', {
    header: () => <div className="w-full text-left">Type</div>,
    cell: (props) => <div className="w-full text-left">{props.getValue()}</div>,
  }),
  table.createDisplayColumn({
    id: 'from',
    accessorFn: (props) => (tableProps.type === FuroTableType.INCOMING ? props.createdBy.id : props.recipient.id),
    header: () => <div className="w-full text-left">From</div>,
    cell: (props) => <div className="w-full text-left text-blue">{shortenAddress(props.getValue() as string)}</div>,
  }),
  table.createDataColumn('startTime', {
    header: () => <div className="w-full text-left">Start Date</div>,
    cell: (props) => (
      <div className="flex flex-col gap-0.5">
        <Typography variant="sm">
          {props.getValue().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC',
          })}
        </Typography>
      </div>
    ),
  }),
]

export const FuroTable: FC<FuroTableProps> = (props) => {
  const { streams, vestings, placeholder, loading } = props
  const [initialized, setInitialized] = useState(loading)

  useEffect(() => {
    if (!loading) setInitialized(true)
  }, [loading])

  const router = useRouter()
  const { activeChain } = useNetwork()
  const data = useMemo(
    () =>
      streams?.map((stream) => new Stream({ stream })).concat(vestings?.map((vesting) => new Vesting({ vesting }))) ??
      [],
    [streams, vestings],
  )

  const [columns] = React.useState<typeof defaultColumns>(() => [...defaultColumns(props)])

  const instance = useTableInstance(table, {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table.container>
      <Table.table>
        <Table.thead>
          {instance.getHeaderGroups().map((headerGroup, i) => (
            <Table.thr key={headerGroup.id}>
              {initialized && streams.length === 0 && vestings.length == 0 ? (
                <th colSpan={headerGroup.headers.length} className="border-b border-slate-800">
                  <div className="w-full h-12 animate-pulse bg-slate-800/30" />
                </th>
              ) : (
                headerGroup.headers.map((header, i) => (
                  <Table.th key={header.id} colSpan={header.colSpan}>
                    {header.renderHeader()}
                  </Table.th>
                ))
              )}
            </Table.thr>
          ))}
        </Table.thead>
        <Table.tbody>
          {instance.getRowModel().rows.length === 0 && (
            <Table.tr>
              {initialized && streams.length === 0 && vestings.length == 0 ? (
                <td colSpan={columns.length}>
                  <div className="w-full h-12 animate-pulse bg-slate-800/30" />
                </td>
              ) : (
                <Table.td colSpan={columns.length} className="text-center text-slate-500">
                  {placeholder}
                </Table.td>
              )}
            </Table.tr>
          )}
          {instance.getRowModel().rows.map((row) => {
            return (
              <Table.tr
                key={row.id}
                onClick={() =>
                  router.push({
                    pathname: `/${row.original?.type.toLowerCase()}/${row.original?.id}`,
                    query: { chainId: activeChain?.id },
                  })
                }
              >
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

export default FuroTable
