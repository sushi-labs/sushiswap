import Link from 'next/link'
import React, { FC } from 'react'
import { useTable } from 'react-table'
import { Stream } from '../../interfaces/stream'
import { shortenAddress } from 'format'

interface StreamsProps {
  incomingStreams: Stream[]
}

const IncomingStreamsTable: FC<StreamsProps> = (props) => {
  const data = props.incomingStreams ?? []

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
        Header: 'FROM',
        accessor: 'createdBy.id',
        Cell: (props) => shortenAddress(props.value),
      },
      {
        Header: 'STREAMED',
        accessor: 'streamed',
      },
      {
        Header: 'START',
        accessor: 'startedAt',
        Cell: (props) => {
          return (
            <>
              <div>{new Date(parseInt(props.value)).toLocaleDateString()}</div>
              <div>{new Date(parseInt(props.value)).toLocaleTimeString()}</div>
            </>
          )
        },
      },
      {
        Header: 'END',
        accessor: 'expiresAt',
        Cell: (props) => {
          return (
            <>
              <div>{new Date(parseInt(props.value)).toLocaleDateString()}</div>
              <div>{new Date(parseInt(props.value)).toLocaleTimeString()}</div>
            </>
          )
        },
      },
      {
        Header: '',
        accessor: 'view',
        Cell: (props) => <Link href={'/stream/'.concat(props.row.original.id)}> View </Link>,
      },
    ],
    [],
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data })

  return (
    <table
      {...getTableProps()}

    >
      <thead>
        {headerGroups.map((headerGroup, i) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={i}>
            {headerGroup.headers.map((column, i) => (
              <th
                {...column.getHeaderProps()}

                key={i}
              >
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
                  <td
                    {...cell.getCellProps()}
                    key={i}
                  >
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
export default IncomingStreamsTable
