import { AddressZero } from '@ethersproject/constants'
import { Chain } from '@sushiswap/chain'
import { Amount, Token, WNATIVE_ADDRESS } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { Chip, ProgressBar, ProgressColor, Table, Typography } from '@sushiswap/ui'
import { createTable, FilterFn, getCoreRowModel, getFilteredRowModel, useTableInstance } from '@tanstack/react-table'
import { FuroStatus, Stream, Vesting } from 'lib'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, ReactNode, useEffect, useMemo, useState } from 'react'

import { Placeholder } from './Placeholder'
import { type Stream as StreamDTO, type Vesting as VestingDTO, Rebase as RebaseDTO } from '.graphclient'

export enum FuroTableType {
  INCOMING,
  OUTGOING,
}

interface FuroTableProps {
  chainId: number | undefined
  balances: Record<string, Amount<Token>> | undefined
  globalFilter: any
  setGlobalFilter: any
  streams: StreamDTO[]
  vestings: VestingDTO[]
  rebases: RebaseDTO[] | undefined
  type: FuroTableType
  placeholder: ReactNode
  loading: boolean
}

// @ts-ignore
const showActiveOnly: FilterFn<Stream | Vesting> = (row, columnId) => {
  return row.getValue(columnId) === FuroStatus.ACTIVE
}

const table = createTable()
  .setRowType<Stream | Vesting>()
  .setOptions({
    filterFns: {
      // @ts-ignore
      showActiveOnly: showActiveOnly,
    },
  })

const defaultColumns = (tableProps: FuroTableProps) => [
  table.createDataColumn('streamedPercentage', {
    header: () => <div className="w-full text-left">Streamed</div>,
    cell: (props) => (
      <div className="flex gap-3">
        <ProgressBar
          showLabel={false}
          className="min-w-[100px] max-w-[100px] h-3"
          progress={Number(props.getValue()?.divide(100).toSignificant(4))}
          color={ProgressColor.BLUE}
        />
        <Typography variant="sm" weight={700} className="text-slate-200">
          {props.getValue()?.toSignificant(4)}%
        </Typography>
      </div>
    ),
  }),
  table.createDataColumn('status', {
    header: () => <div className="w-full text-left">Status</div>,
    filterFn: 'showActiveOnly',
    cell: (props) => (
      <Chip
        className="capitalize"
        label={props.getValue() === FuroStatus.EXTENDED ? 'Active' : props.getValue().toLowerCase()}
        color={
          props.getValue() === FuroStatus.CANCELLED
            ? 'red'
            : props.getValue() === FuroStatus.COMPLETED
            ? 'green'
            : props.getValue() === FuroStatus.ACTIVE
            ? 'blue'
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
      return (
        <div className="flex flex-col w-full">
          <Typography variant="sm" weight={700} className="text-right text-slate-200">
            {props.getValue().greaterThan('0') ? props.getValue().toSignificant(6) : '< 0.01'}{' '}
            <span className="font-medium text-slate-500">{props.row.original?.token.symbol}</span>
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
    header: () => <div className="w-full text-left">{tableProps.type === FuroTableType.INCOMING ? 'From' : 'To'}</div>,
    cell: (props) =>
      tableProps.chainId ? (
        <Link href={Chain.from(tableProps.chainId).getAccountUrl(props.getValue() as string)} passHref={true}>
          <a
            target="_blank"
            className="w-full text-left text-blue hover:text-blue-200"
            onClick={(e) => e.stopPropagation()}
          >
            {shortenAddress(props.getValue() as string)}
          </a>
        </Link>
      ) : null,
  }),
  table.createDataColumn('startTime', {
    header: () => <div className="w-full text-left">Start Date</div>,
    cell: (props) => (
      <div className="flex flex-col gap-0.5">
        <Typography variant="sm" className="whitespace-nowrap">
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
  const { chainId, streams, vestings, rebases, placeholder, loading } = props
  const [initialized, setInitialized] = useState(!loading)

  useEffect(() => {
    if (!loading) setInitialized(true)
  }, [loading])

  const router = useRouter()
  const data = useMemo(() => {
    if (!chainId || !streams || !vestings || !rebases) return []
    return streams
      .map(
        (stream) =>
          new Stream({
            chainId,
            furo: stream,
            rebase: rebases.find((rebase) =>
              stream.token.id === AddressZero
                ? WNATIVE_ADDRESS[chainId].toLowerCase() === rebase.id
                : rebase.id === stream.token.id
            ) as RebaseDTO,
          })
      )
      .concat(
        vestings?.map(
          (vesting) =>
            new Vesting({
              furo: vesting,
              chainId,
              rebase: rebases.find((rebase) =>
                vesting.token.id === AddressZero
                  ? WNATIVE_ADDRESS[chainId].toLowerCase() === rebase.id
                  : rebase.id === vesting.token.id
              ) as RebaseDTO,
            })
        )
      )
    //rebase: rebases.find(rebase => rebase.id === vesting.token) as { base: string; elastic: string }
  }, [chainId, streams, vestings, rebases])

  const [columns] = React.useState<typeof defaultColumns>(() => [...defaultColumns({ ...props, chainId })])

  const instance = useTableInstance(table, {
    data,
    // @ts-ignore
    columns,
    state: {
      globalFilter: props.globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'showActiveOnly',
    onGlobalFilterChange: props.setGlobalFilter,
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
                <Table.td className="h-12">
                  <div className="h-4 rounded-full animate-pulse bg-slate-800" />
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
              <Table.tr
                key={row.id}
                onClick={() =>
                  router.push({
                    pathname: `/${row.original?.type.toLowerCase()}/${row.original?.id}`,
                    query: { chainId },
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
