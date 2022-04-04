import Link from 'next/link'
import React, { FC, useEffect, useState } from 'react'
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
        Header: 'Status',
        accessor: 'status',
        Cell: (props) => {
          return props.value !== "CANCELLED" ? 
          <p style={{ color: '#7CFD6B' }}>{props.value}</p> 
          :<p style={{ color: '#fc6c6c' }}>{props.value}</p> 
        },
      },
      {
        Header: 'From',
        accessor: 'recipient.id',
      },
      {
        Header: 'Streamed',
        accessor: 'dunno',
      },
      {
        Header: 'Start',
        accessor: 'startedAt',
        Cell: (props) => {
          return <>
          <div>{new Date(parseInt(props.value)).toLocaleDateString()}</div>
          <div>{new Date(parseInt(props.value)).toLocaleTimeString()}</div>
          </>
        },
      },
      {
        Header: 'Expiration',
        accessor: 'expiresAt',
        Cell: (props) => {
          return <>
          <div>{new Date(parseInt(props.value)).toLocaleDateString()}</div>
          <div>{new Date(parseInt(props.value)).toLocaleTimeString()}</div>
          </>
        },
      },
      {
        Header: 'View',
        accessor: 'view',
        Cell: (props) => {
          return <Link href={'/stream/'.concat('/').concat(props.row.original.id)}> View </Link>
        },

      },
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })

  return (
          
    <table {...getTableProps()} className="w-auto min-w-full border-collapse table-fixed">
    <thead>
      {headerGroups.map((headerGroup, i) => (
        <tr {...headerGroup.getHeaderGroupProps()} key={`thr-${i}`}>
          {headerGroup.headers.map((column, i) => (
            <th
              {...column.getHeaderProps()}
              style={{
                borderBottom: 'solid 3px #2E3348',
                background: '#202231',
                color: '#7F7F7F',
                padding: '5px'
              }}
              key={`th-${i}`}
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
          <tr {...row.getRowProps()} key={`row-${i}`}>
            {row.cells.map((cell, i) => {
              return (
                <td
                  {...cell.getCellProps()}
                  style={{
                    padding: '10px',
                    border: 'solid 1px #2E3348',
                    background: '#161522',
                    color: '#7F7F7F',
                  }}
                  key={`cell-${i}`}
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
