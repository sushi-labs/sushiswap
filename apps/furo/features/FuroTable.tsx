import { ChevronRightIcon } from '@heroicons/react/solid'
import { formatNumber, shortenAddress } from '@sushiswap/format'
import { useRouter } from 'next/router'
import React, { FC, useMemo } from 'react'
import { useFlexLayout, useTable } from 'react-table'
import { classNames, ProgressColor, Table, ProgressBar, Typography } from '@sushiswap/ui'
import { FuroStatus } from './context/enums'
import { StreamRepresentation, VestingRepresentation } from './context/representations'
import { Stream } from './context/Stream'
import { Vesting } from './context/Vesting'

export enum FuroTableType {
  INCOMING,
  OUTGOING,
}

interface FuroTableProps {
  streams: StreamRepresentation[]
  vestings: VestingRepresentation[]
  type: FuroTableType
}

export const FuroTable: FC<FuroTableProps> = ({ streams, vestings, type }) => {
  const router = useRouter()
  const data = useMemo(
    () =>
      streams?.map((stream) => new Stream({ stream })).concat(vestings?.map((vesting) => new Vesting({ vesting }))) ??
      [],
    [streams, vestings],
  )
  // console.log({ data })
  const columns = useMemo(
    () => [
      {
        Header: 'TYPE',
        accessor: 'type',
        maxWidth: 80,
        Cell: ({ value }) => value,
      },
      {
        Header: 'STATUS',
        accessor: 'status',
        maxWidth: 120,
        Cell: ({ value }) => (
          <Typography
            variant="xs"
            weight={700}
            className={classNames('uppercase', value !== 'CANCELLED' ? 'text-green' : 'text-red')}
          >
            {value}
          </Typography>
        ),
      },
      {
        Header: type === FuroTableType.INCOMING ? 'FROM' : 'TO',
        accessor: type === FuroTableType.INCOMING ? 'createdBy.id' : 'recipient.id',
        maxWidth: 120,
        Cell: (props) => shortenAddress(props.value),
      },
      {
        Header: 'VALUE',
        accessor: 'amount',
        Cell: (props) => {
          if (props.row.original.status === FuroStatus.CANCELLED) {
            return `-`
          }
          const formattedAmount = formatNumber(props.value.toExact())
          return `${formattedAmount} ${props.row.original.token.symbol}`
        },
      },
      {
        Header: 'STREAMED',
        accessor: 'streamedPercentage',
        width: 220,
        minWidth: 230,
        maxWidth: 230,
        Cell: (props) => (
          <div className="flex flex-grow gap-2">
            <ProgressBar
              showLabel={false}
              className="min-w-[160px] max-w-[160px]"
              progress={Math.min(Math.max(props.value, 0), 1)}
              color={ProgressColor.BLUE}
            />
            <Typography variant="sm" weight={400} className="text-high-emphesis">
              {(Number(Math.min(Math.max(props.value, 0), 1)) * 100).toFixed(1)}%
            </Typography>
          </div>
        ),
      },
      {
        Header: 'START TIME',
        accessor: 'startTime',
        maxWidth: 120,
        Cell: (props) => {
          return (
            <div className="flex flex-col gap-0.5">
              <Typography variant="xs">{props.value.toDateString()}</Typography>
              <Typography variant="xs">{props.value.toTimeString()}</Typography>
            </div>
          )
        },
      },
      {
        Header: 'END TIME',
        accessor: 'endTime',
        maxWidth: 120,
        Cell: (props) => {
          return (
            <div className="flex flex-col gap-0.5">
              <Typography variant="xs">{props.value.toDateString()}</Typography>
              <Typography variant="xs">{props.value.toTimeString()}</Typography>
            </div>
          )
        },
      },
      {
        Header: '',
        maxWidth: 60,
        accessor: 'view',
        Cell: () => (
          <div className="inline-flex justify-end w-full rounded-full cursor-pointer hover:text-white">
            <ChevronRightIcon width={20} height={20} />
          </div>
        ),
      },
    ],
    [type],
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    { columns, data },
    useFlexLayout,
  )

  return (
    <Table.container>
      <Table.table {...getTableProps()}>
        <Table.thead>
          {headerGroups.map((headerGroup, i) => (
            <Table.thr {...headerGroup.getHeaderGroupProps()} key={i}>
              {headerGroup.headers.map((column, i) => (
                <Table.th {...column.getHeaderProps()} key={i}>
                  {column.render('Header')}
                </Table.th>
              ))}
            </Table.thr>
          ))}
        </Table.thead>
        <Table.tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <Table.tr
                {...row.getRowProps()}
                onClick={() => router.push(`/${row.original.type.toLowerCase()}/${row.original.id}`)}
                key={i}
              >
                {row.cells.map((cell, i) => {
                  return (
                    <Table.td {...cell.getCellProps()} key={i}>
                      {cell.render('Cell')}
                    </Table.td>
                  )
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
