import { formatUnits } from '@ethersproject/units'
import { BigNumber } from 'ethers'
import { formatNumber, shortenAddress } from 'format'
import Link from 'next/link'
import React, { FC } from 'react'
import { useTable } from 'react-table'
import ProgressBar, { ProgressColor } from '../../components/ProgressBar'
import { calculateStreamedPercentage } from '../../functions'
import { Stream } from '../../interfaces/stream/Stream'
import { RawStream, StreamStatus } from '../../interfaces/stream/types'
// import { formatUSD, shortenAddress } from 'format'

interface StreamsProps {
  outgoingStreams: RawStream[]
}

const OutgoingStreamsTable: FC<StreamsProps> = (props) => {
  const data = props.outgoingStreams.map((stream) => new Stream({ stream })) ?? []

  const columns = React.useMemo(
    () => [
      {
        Header: 'STATUS',
        accessor: 'status',
        Cell: (props) => {
          return props.value !== 'CANCELLED' ? (
            <p style={{ color: '#7CFD6B' }}>{props.value}</p>
          ) : (
            <p style={{ color: '#fc6c6c' }}>{props.value}</p>
          )
        },
      },
      {
        Header: 'TO',
        accessor: 'recipient.id',
        Cell: (props) => shortenAddress(props.value),
      },
      {
        Header: 'VALUE',
        accessor: 'amount',
        Cell: (props) => {
          if (props.row.original.status === StreamStatus.CANCELLED) {
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
        Cell: (props) => {
          return (
            <div className="w-40">
              <ProgressBar progress={props.value} color={ProgressColor.BLUE} />
            </div>
          )
        },
      },
      {
        Header: 'START TIME',
        accessor: 'startTime',
        Cell: (props) => {
          return (
            <>
              <div>{props.value.toLocaleDateString()}</div>
              <div>{props.value.toLocaleTimeString()}</div>
            </>
          )
        },
      },
      {
        Header: 'END TIME',
        accessor: 'endTime',
        Cell: (props) => {
          return (
            <>
              <div>{props.value.toLocaleDateString()}</div>
              <div>{props.value.toLocaleTimeString()}</div>
            </>
          )
        },
      },
      {
        Header: '',
        accessor: 'view',
        Cell: (props) => {
          return (
            <>
              <Link href={'/stream/'.concat(props.row.original.id)}> View </Link>
              <p>Edit</p>
              {/* <button onClick={() => cancelStream(stream.id)}>Cancel</button> */}
            </>
          )
        },
      },
    ],
    [],
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data })

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup, i) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={i}>
            {headerGroup.headers.map((column, i) => (
              <th {...column.getHeaderProps()} key={i}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()} key={i}>
              {row.cells.map((cell, i) => {
                return (
                  <td {...cell.getCellProps()} key={i}>
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
export default OutgoingStreamsTable
