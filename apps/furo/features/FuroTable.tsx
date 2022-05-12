import { shortenAddress } from '@sushiswap/format'
import { useRouter } from 'next/router'
import React, { FC, useMemo } from 'react'
import { createTable, getCoreRowModel, useTableInstance } from '@tanstack/react-table'
import { ProgressColor, Table, ProgressBar, Typography, Chip } from '@sushiswap/ui'
import { FuroStatus } from './context/enums'
import { StreamRepresentation, VestingRepresentation } from './context/representations'
import { Stream } from './context/Stream'
import { Vesting } from 'features/context'
import { useNetwork } from 'wagmi'

export enum FuroTableType {
  INCOMING,
  OUTGOING,
}

interface FuroTableProps {
  streams: StreamRepresentation[]
  vestings: VestingRepresentation[]
  type: FuroTableType
  placeholder: string
}

const table = createTable().setRowType<Stream>()

const defaultColumns = (tableProps: FuroTableProps) => [
  table.createDataColumn('streamedPercentage', {
    header: () => <div className="text-left w-full">Streamed</div>,
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
    header: () => <div className="text-left w-full">Status</div>,
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
  table.createDisplayColumn({
    id: 'from',
    accessorFn: (props) => (tableProps.type === FuroTableType.INCOMING ? props.createdBy.id : props.recipient.id),
    header: () => <div className="text-left w-full">From</div>,
    cell: (props) => <div className="text-left w-full text-blue">{shortenAddress(props.getValue() as string)}</div>,
  }),
  table.createDataColumn('startTime', {
    header: () => <div className="text-left w-full">Start Date</div>,
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
  table.createDataColumn('type', {
    header: () => <div className="text-left w-full">Type</div>,
    cell: (props) => <div className="text-left w-full">{props.getValue()}</div>,
  }),
  table.createDataColumn('amount', {
    header: () => <div className="text-right w-full">Amount</div>,
    cell: (props) => {
      if (props.row.original?.status === FuroStatus.CANCELLED) return `-`
      return (
        <div className="flex flex-col w-full">
          <Typography variant="sm" weight={700} className="text-slate-200 text-right">
            {props.getValue().greaterThan('0') ? props.getValue().toSignificant(6) : '< 0.01'}
          </Typography>
          <Typography variant="xs" weight={500} className="text-right text-slate-500">
            {props.row.original?.token.symbol}
          </Typography>
        </div>
      )
    },
  }),
]

export const FuroTable: FC<FuroTableProps> = (props) => {
  const { streams, vestings, placeholder } = props

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
              {headerGroup.headers.map((header, i) => (
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
              <Table.td colSpan={columns.length}>{placeholder}</Table.td>
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
