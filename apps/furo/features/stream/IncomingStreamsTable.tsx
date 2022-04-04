import Link from 'next/link'
import React, { FC } from 'react'
import { useTable } from 'react-table'
import { Stream } from '../../interfaces/stream'
// import { formatUSD, shortenAddress } from 'format'

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
      },
      {
        Header: 'STREAMED',
        accessor: 'dunno',
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
        Cell: (props) => {
          return <Link href={'/stream/'.concat(props.row.original.id)}> View </Link>
        },
      },
    ],
    [],
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data })

  return (
    <table
      {...getTableProps()}
      style={{
        border: 'solid 1px #2E3348',
        borderRadius: '10px',
      }}
    >
      <thead>
        {headerGroups.map((headerGroup, i) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={i}>
            {headerGroup.headers.map((column, i) => (
              <th
                {...column.getHeaderProps()}
                style={{
                  borderBottom: 'solid 3px #2E3348',
                  background: '#202231',
                  color: '#7F7F7F',
                  padding: '5px',
                  fontWeight: 'normal',
                }}
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
                    style={{
                      padding: '10px',
                      borderBottom: 'solid 1px #2E3348',
                      background: '#161522',
                      color: '#7F7F7F',
                    }}
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
