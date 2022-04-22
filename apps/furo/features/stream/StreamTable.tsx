import { formatUnits } from '@ethersproject/units'
import { ChevronRightIcon } from '@heroicons/react/solid'
import { BigNumber } from 'ethers'
import { formatNumber, shortenAddress } from 'format'
import { useRouter } from 'next/router'
import React, { FC, useMemo } from 'react'
import { useFlexLayout, useTable } from 'react-table'
import { ProgressColor, Table } from 'ui'
import { classNames } from 'ui/lib/classNames'
import ProgressBar from 'ui/progressbar/ProgressBar'
import Typography from 'ui/typography/Typography'
import { Status, StreamRepresentation } from '../context/representations'
import { Stream } from '../context/Stream'

interface StreamsProps {
  streams: StreamRepresentation[]
}

export const StreamTable: FC<StreamsProps> = ({ streams }) => {
  const router = useRouter()
  const data = useMemo(() => streams?.map((stream) => new Stream({ stream })) ?? [], [streams])
  const columns = useMemo(
    () => [
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
        Header: 'FROM',
        accessor: 'createdBy.id',
        maxWidth: 120,
        Cell: (props) => shortenAddress(props.value),
      },
      {
        Header: 'VALUE',
        accessor: 'amount',
        Cell: (props) => {
          if (props.row.original.status === Status.CANCELLED) {
            return `-`
          }
          const amount = formatUnits(BigNumber.from(props.value), BigNumber.from(props.row.original.token.decimals))
          const formattedAmount = formatNumber(amount)
          return `${formattedAmount} ${props.row.original.token.symbol}`
        },
      },
      {
        Header: 'STREAMED',
        accessor: 'streamedPercentage',
        width: 220,
        minWidth: 220,
        maxWidth: 220,
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
              <Typography variant="xs">{props.value.toLocaleDateString()}</Typography>
              <Typography variant="xs">{props.value.toLocaleTimeString()}</Typography>
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
              <Typography variant="xs">{props.value.toLocaleDateString()}</Typography>
              <Typography variant="xs">{props.value.toLocaleTimeString()}</Typography>
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
    [],
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
              <Table.tr {...row.getRowProps()} onClick={() => router.push(`/stream/${row.original.id}`)} key={i}>
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

export default StreamTable
