import { formatUnits } from '@ethersproject/units'
import { BigNumber } from 'ethers'
import { formatNumber, shortenAddress } from 'format'
import Link from 'next/link'
import React, { FC } from 'react'
import { useTable } from 'react-table'
import ProgressBar, { ProgressColor } from '../../components/ProgressBar'
import { calculateTimePassed } from '../../functions'
import { Stream, StreamStatus } from '../../interfaces/stream'
// import { formatUSD, shortenAddress } from 'format'

interface StreamsProps {
  outgoingStreams: Stream[]
}

const OutgoingStreamsTable: FC<StreamsProps> = (props) => {
  const data = props.outgoingStreams ?? []

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
        accessor: 'streamed',
        Cell: (props) => {
          return (
            <div className="w-40">
              <ProgressBar progress={calculateTimePassed(props.row.original)} color={ProgressColor.BLUE} />
            </div>
          )
        },
      },
      {
        Header: 'START TIME',
        accessor: 'startedAt',
        Cell: (props) => {
          return (
            <>
              <div>{new Date(parseInt(props.value) * 1000).toLocaleDateString()}</div>
              <div>{new Date(parseInt(props.value) * 1000).toLocaleTimeString()}</div>
            </>
          )
        },
      },
      {
        Header: 'END TIME',
        accessor: 'expiresAt',
        Cell: (props) => {
          return (
            <>
              <div>{new Date(parseInt(props.value) * 1000).toLocaleDateString()}</div>
              <div>{new Date(parseInt(props.value) * 1000).toLocaleTimeString()}</div>
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
